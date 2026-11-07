import React, { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import poolPhoto from '../images/resort-pool.webp';
import lakePhoto from '../images/lakeside-seating.webp';
import './FluidGalleryImage.css';

const VERTEX_SHADER = `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D u_from;
  uniform sampler2D u_to;
  uniform vec2 u_resolution;
  uniform vec2 u_fromSize;
  uniform vec2 u_toSize;
  uniform float u_progress;
  uniform float u_time;
  uniform float u_fit;
  uniform float u_direction;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    f = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i), hash(i + vec2(1.0, 0.0)), f.x),
               mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
  }

  vec2 fitUv(vec2 uv, vec2 imageSize, out float inside) {
    float imageAspect = imageSize.x / max(imageSize.y, 1.0);
    float viewAspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 scale = vec2(1.0);

    if (u_fit > 0.5) {
      if (imageAspect > viewAspect) scale = vec2(1.0, viewAspect / imageAspect);
      else scale = vec2(imageAspect / viewAspect, 1.0);
      vec2 offset = (1.0 - scale) * 0.5;
      vec2 localUv = (uv - offset) / scale;
      inside = step(offset.x, uv.x) * step(uv.x, offset.x + scale.x) *
               step(offset.y, uv.y) * step(uv.y, offset.y + scale.y);
      return localUv;
    }

    if (imageAspect > viewAspect) scale.x = viewAspect / imageAspect;
    else scale.y = imageAspect / viewAspect;
    inside = 1.0;
    return (uv - 0.5) * scale + 0.5;
  }

  void main() {
    float aspect = u_resolution.x / max(u_resolution.y, 1.0);
    vec2 center = vec2(0.5) + vec2(0.045, -0.035) * u_direction;
    vec2 waterUv = (vUv - center) * vec2(aspect, 1.0);
    float radius = length(waterUv);
    float maxRadius = length(vec2(aspect * 0.5, 0.5)) + 0.08;
    float progress = clamp(u_progress, 0.0, 1.0);
    float front = progress * maxRadius - 0.045;
    float organic = (noise(vUv * vec2(9.0, 15.0) + u_time * 0.055) - 0.5) * 0.05;
    float ring = sin((radius - front) * 78.0 + noise(vUv * 12.0) * 2.2);
    float envelope = sin(progress * 3.14159265);
    float edge = front + organic + ring * 0.009 * envelope;
    float reveal = 1.0 - smoothstep(edge - 0.026, edge + 0.026, radius);

    vec2 radial = waterUv / max(radius, 0.0001);
    vec2 ripple = radial * ring * 0.009 * envelope;
    ripple += vec2(noise(vUv * 18.0 + u_time * 0.08) - 0.5,
                   noise(vUv.yx * 18.0 - u_time * 0.07) - 0.5) * 0.003 * envelope;

    float fromInside;
    float toInside;
    vec2 fromUv = fitUv(vUv + ripple, u_fromSize, fromInside);
    vec2 toUv = fitUv(vUv - ripple * 1.15, u_toSize, toInside);
    vec4 fromColor = texture2D(u_from, fromUv);
    vec4 toColor = texture2D(u_to, toUv);
    float transition = reveal * toInside;
    vec3 color = mix(fromColor.rgb, toColor.rgb, transition);
    float crest = exp(-pow((radius - front) * 95.0, 2.0)) * envelope;
    color += vec3(0.026, 0.038, 0.027) * crest;

    float alpha = mix(fromInside, max(fromInside, toInside), reveal);
    gl_FragColor = vec4(color, alpha);
  }
`;

function loadTexture(loader, url, THREE) {
  return loader.loadAsync(url).then((texture) => {
    texture.colorSpace = THREE.SRGBColorSpace;
    texture.minFilter = THREE.LinearFilter;
    texture.magFilter = THREE.LinearFilter;
    texture.generateMipmaps = false;
    texture.wrapS = THREE.ClampToEdgeWrapping;
    texture.wrapT = THREE.ClampToEdgeWrapping;
    return texture;
  });
}

export default function FluidGalleryImage({ src, alt, imageClassName, stageClassName = '', fit = 'cover', active = true, onClick }) {
  const stageRef = useRef(null);
  const canvasRef = useRef(null);
  const maskImageRef = useRef(null);
  const rendererRef = useRef(null);
  const sceneRef = useRef(null);
  const materialRef = useRef(null);
  const resizeObserverRef = useRef(null);
  const tweenRef = useRef(null);
  const maskTweenRef = useRef(null);
  const textureRef = useRef([]);
  const sequenceRef = useRef(0);
  const fallbackTimerRef = useRef(null);
  const [displayed, setDisplayed] = useState({ src, alt });
  const [maskTarget, setMaskTarget] = useState(null);
  const [webglTransitioning, setWebglTransitioning] = useState(false);
  const [fallbackPair, setFallbackPair] = useState(null);
  const [fallbackEntered, setFallbackEntered] = useState(false);

  const getRenderer = (THREE) => {
    if (rendererRef.current) return rendererRef.current;
    if (!stageRef.current || !canvasRef.current) throw new Error('No gallery canvas available');

    const renderer = new THREE.WebGLRenderer({
      canvas: canvasRef.current,
      alpha: true,
      antialias: false,
      powerPreference: 'low-power',
      premultipliedAlpha: false,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.35));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0);

    const uniforms = {
      u_from: { value: null },
      u_to: { value: null },
      u_resolution: { value: new THREE.Vector2(1, 1) },
      u_fromSize: { value: new THREE.Vector2(1, 1) },
      u_toSize: { value: new THREE.Vector2(1, 1) },
      u_progress: { value: 0 },
      u_time: { value: 0 },
      u_fit: { value: fit === 'contain' ? 1 : 0 },
      u_direction: { value: 1 },
    };
    const material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      transparent: true,
      depthTest: false,
      depthWrite: false,
    });
    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
    const geometry = new THREE.PlaneGeometry(2, 2);
    scene.add(new THREE.Mesh(geometry, material));

    const resize = () => {
      if (!stageRef.current || !rendererRef.current) return;
      const { width, height } = stageRef.current.getBoundingClientRect();
      if (!width || !height) return;
      renderer.setSize(width, height, false);
      material.uniforms.u_resolution.value.set(width, height);
    };

    rendererRef.current = renderer;
    sceneRef.current = { scene, camera, geometry };
    materialRef.current = material;
    resize();

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserverRef.current = new ResizeObserver(resize);
      resizeObserverRef.current.observe(stageRef.current);
    } else {
      window.addEventListener('resize', resize, { passive: true });
      resizeObserverRef.current = { disconnect: () => window.removeEventListener('resize', resize) };
    }

    return renderer;
  };

  useEffect(() => {
    if (src === displayed.src) {
      setWebglTransitioning(false);
      setFallbackPair(null);
      setMaskTarget(null);
      return undefined;
    }
    const sequence = ++sequenceRef.current;
    const isPoolLakePair = [poolPhoto, lakePhoto].includes(src) && [poolPhoto, lakePhoto].includes(displayed.src);
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const mobileFallback = window.matchMedia('(max-width: 640px)').matches;
    let fromTexture;
    let toTexture;
    let canceled = false;
    let fallbackFrame;

    const beginFallback = () => {
      setWebglTransitioning(false);
      setFallbackPair({ from: displayed, to: { src, alt } });
      setFallbackEntered(false);
      fallbackFrame = requestAnimationFrame(() => setFallbackEntered(true));
      fallbackTimerRef.current = window.setTimeout(() => {
        setDisplayed({ src, alt });
        setFallbackPair(null);
        setFallbackEntered(false);
      }, 760);
    };

    if (!active || reduceMotion) {
      setDisplayed({ src, alt });
      setFallbackPair(null);
      setWebglTransitioning(false);
      setMaskTarget(null);
      return undefined;
    }

    if (!isPoolLakePair) {
      setMaskTarget({ src, alt, sequence });
      setFallbackPair(null);
      setWebglTransitioning(false);
      return undefined;
    }

    setMaskTarget(null);

    if (mobileFallback) {
      beginFallback();
      return () => {
        canceled = true;
        cancelAnimationFrame(fallbackFrame);
        if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      };
    }

    const begin = async () => {
      try {
        const THREE = await import('./three-fluid-engine.js');
        const renderer = getRenderer(THREE);
        const loader = new THREE.TextureLoader();
        const loadedTextures = await Promise.allSettled([
          loadTexture(loader, displayed.src, THREE),
          loadTexture(loader, src, THREE),
        ]);
        if (loadedTextures.some((result) => result.status === 'rejected')) {
          loadedTextures.forEach((result) => {
            if (result.status === 'fulfilled') result.value.dispose();
          });
          throw new Error('Unable to load gallery images for the fluid transition');
        }
        [fromTexture, toTexture] = loadedTextures.map((result) => result.value);
        if (canceled || sequence !== sequenceRef.current) {
          fromTexture.dispose();
          toTexture.dispose();
          return;
        }

        textureRef.current.forEach((texture) => texture.dispose());
        textureRef.current = [fromTexture, toTexture];
        const uniforms = materialRef.current.uniforms;
        uniforms.u_from.value = fromTexture;
        uniforms.u_to.value = toTexture;
        uniforms.u_fromSize.value.set(fromTexture.image.width, fromTexture.image.height);
        uniforms.u_toSize.value.set(toTexture.image.width, toTexture.image.height);
        uniforms.u_progress.value = 0;
        uniforms.u_time.value = 0;
        uniforms.u_fit.value = fit === 'contain' ? 1 : 0;
        uniforms.u_direction.value = src === lakePhoto ? 1 : -1;
        setWebglTransitioning(true);

        const draw = () => {
          if (!rendererRef.current || !sceneRef.current) return;
          uniforms.u_time.value += 0.025;
          try {
            renderer.render(sceneRef.current.scene, sceneRef.current.camera);
          } catch {
            tweenRef.current?.kill();
            textureRef.current.forEach((texture) => texture.dispose());
            textureRef.current = [];
            uniforms.u_from.value = null;
            uniforms.u_to.value = null;
            fromTexture = null;
            toTexture = null;
            beginFallback();
          }
        };

        draw();
        tweenRef.current = gsap.to(uniforms.u_progress, {
          value: 1,
          duration: 1.15,
          ease: 'power2.inOut',
          onUpdate: draw,
          onComplete: () => {
            setDisplayed({ src, alt });
            setWebglTransitioning(false);
            textureRef.current.forEach((texture) => texture.dispose());
            textureRef.current = [];
            fromTexture = null;
            toTexture = null;
            uniforms.u_from.value = null;
            uniforms.u_to.value = null;
          },
        });
      } catch {
        if (canceled || sequence !== sequenceRef.current) return;
        beginFallback();
      }
    };

    begin();

    return () => {
      canceled = true;
      tweenRef.current?.kill();
      tweenRef.current = null;
      if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
      cancelAnimationFrame(fallbackFrame);
      const ownedTextures = new Set(textureRef.current);
      textureRef.current.forEach((texture) => texture.dispose());
      textureRef.current = [];
      if (materialRef.current) {
        materialRef.current.uniforms.u_from.value = null;
        materialRef.current.uniforms.u_to.value = null;
      }
      if (fromTexture && !ownedTextures.has(fromTexture)) fromTexture.dispose();
      if (toTexture && !ownedTextures.has(toTexture)) toTexture.dispose();
    };
  }, [src, alt, active, displayed, fit]);

  useEffect(() => {
    if (!maskTarget || !maskImageRef.current) return undefined;
    maskTweenRef.current?.kill();
    maskTweenRef.current = gsap.fromTo(maskImageRef.current,
      { clipPath: 'inset(0% 0% 100% 0%)', opacity: 0.82, scale: 1.035 },
      {
        clipPath: 'inset(0% 0% 0% 0%)',
        opacity: 1,
        scale: 1,
        duration: 0.82,
        ease: 'power3.inOut',
        onComplete: () => {
          if (maskTarget.sequence !== sequenceRef.current) return;
          setDisplayed({ src: maskTarget.src, alt: maskTarget.alt });
          setMaskTarget(null);
        },
      },
    );
    return () => maskTweenRef.current?.kill();
  }, [maskTarget]);

  useEffect(() => () => {
    sequenceRef.current += 1;
    tweenRef.current?.kill();
    maskTweenRef.current?.kill();
    if (fallbackTimerRef.current) window.clearTimeout(fallbackTimerRef.current);
    resizeObserverRef.current?.disconnect();
    textureRef.current.forEach((texture) => texture.dispose());
    if (rendererRef.current) {
      sceneRef.current?.geometry.dispose();
      materialRef.current?.dispose();
      rendererRef.current.dispose();
      rendererRef.current.forceContextLoss();
      rendererRef.current = null;
    }
  }, []);

  return (
    <div ref={stageRef} className={`vt__image-stage ${stageClassName}`} onClick={onClick}>
      <img key={displayed.src} src={displayed.src} alt={displayed.alt} className={imageClassName} />
      {fallbackPair && (
        <>
          <img src={fallbackPair.from.src} alt="" className="vt__fluid-fallback-image vt__fluid-fallback-image--from" />
          <img src={fallbackPair.to.src} alt={fallbackPair.to.alt} className={`vt__fluid-fallback-image vt__fluid-fallback-image--to ${fallbackEntered ? 'is-visible' : ''}`} />
        </>
      )}
      {maskTarget && (
        <img
          ref={maskImageRef}
          src={maskTarget.src}
          alt=""
          aria-hidden="true"
          className={`${imageClassName} vt__mask-reveal-image`}
        />
      )}
      <canvas ref={canvasRef} className={`vt__fluid-canvas ${webglTransitioning ? 'is-visible' : ''}`} aria-hidden="true" />
    </div>
  );
}
