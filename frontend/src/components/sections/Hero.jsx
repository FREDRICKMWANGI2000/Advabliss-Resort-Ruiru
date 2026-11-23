import React, { useRef, useState } from 'react';
import { ArrowDown, ArrowUpRight, ChevronLeft, ChevronRight, Compass } from 'lucide-react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useGSAP } from '@gsap/react';
import { GradientText, AnimatedContent, CountUp } from '../ui/ReactBits';
import FluidGalleryImage from '../ui/FluidGalleryImage';
import { RESORT_STORY } from '../../data/siteData';
import './Hero.css';
import slideLakeside from '../images/garden-banquet.webp';
import slideEntrance from '../images/advabliss-entrance.webp';
import slidePool from '../images/resort-pool.webp';
import slideRopeBridge from '../images/rope-bridge.webp';

gsap.registerPlugin(ScrollTrigger, useGSAP);

const STORY_PHOTOS = [
  {
    id: 'lakeside',
    image: slideLakeside,
    alt: 'Lakeside canopy lounge seating beside the water at Advabliss Resort',
    chapter: 'Waterfront',
    title: 'A quieter side of Ruiru',
  },
  {
    id: 'pool',
    image: slidePool,
    alt: 'The authentic Advabliss Resort swimming pool and tiled sun deck',
    chapter: 'Poolside',
    title: 'Time to slow down',
  },
  {
    id: 'entrance',
    image: slideEntrance,
    alt: 'Advabliss Resort entrance sign, canopy and open gates',
    chapter: 'Your arrival',
    title: 'A warm welcome awaits',
  },
  {
    id: 'rope-bridge',
    image: slideRopeBridge,
    alt: 'The resort’s rope bridge crossing above the water',
    chapter: 'Adventure',
    title: 'Follow the water’s edge',
  },
];

export default function Hero({ onBookNow }) {
  const heroRef = useRef(null);
  const leftGateRef = useRef(null);
  const rightGateRef = useRef(null);
  const cursorRef = useRef(null);
  const storyShowcaseRef = useRef(null);
  const [storyPhotoIndex, setStoryPhotoIndex] = useState(0);

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(min-width: 769px) and (prefers-reduced-motion: no-preference)', () => {
      const timeline = gsap.timeline({
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=155%',
          scrub: 0.7,
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
        },
      });

      timeline
        .to(leftGateRef.current, { xPercent: -101, duration: 0.5, ease: 'none' }, 0)
        .to(rightGateRef.current, { xPercent: 101, duration: 0.5, ease: 'none' }, 0)
        .to('.gateway__pool-image', { scale: 1, duration: 1.05, ease: 'none' }, 0)
        .to('.gateway__veil', { opacity: 0.12, duration: 0.55, ease: 'none' }, 0)
        .to('.gateway__copy', { yPercent: -14, opacity: 0, duration: 0.22, ease: 'none' }, 0.1)
        .to('.gateway__reveal-copy--pool', { y: 0, opacity: 1, duration: 0.2, ease: 'power2.out' }, 0.34)
        .to('.gateway__reveal-copy--pool', { yPercent: -12, opacity: 0, duration: 0.14, ease: 'power2.in' }, 0.57)
        .fromTo('.gateway__lake-panel', { y: () => heroRef.current.offsetHeight * 1.05 }, { y: 0, duration: 0.46, stagger: 0.075, ease: 'power2.out' }, 0.62)
        .fromTo('.gateway__lake-panel img', { scale: 1.08 }, { scale: 1, duration: 0.61, stagger: 0.075, ease: 'none' }, 0.62)
        .to('.gateway__reveal-copy--lake', { y: 0, opacity: 1, duration: 0.22, ease: 'power2.out' }, 1.03);

      const refresh = () => ScrollTrigger.refresh();
      const images = heroRef.current.querySelectorAll('img');
      images.forEach((image) => {
        if (!image.complete) image.addEventListener('load', refresh, { once: true });
      });
      document.fonts?.ready?.then(refresh);
      return () => images.forEach((image) => image.removeEventListener('load', refresh));
    });

    return () => media.revert();
  }, { scope: heroRef });

  useGSAP(() => {
    const media = gsap.matchMedia();
    media.add('(prefers-reduced-motion: no-preference)', () => {
      gsap.fromTo('.story-showcase__stage',
        { clipPath: 'inset(12% 0% 12% 0%)', opacity: 0.72 },
        {
          clipPath: 'inset(0% 0% 0% 0%)',
          opacity: 1,
          duration: 1.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: storyShowcaseRef.current,
            start: 'top 78%',
            once: true,
          },
        },
      );
      gsap.to('.story-showcase__stage', {
        yPercent: -2.5,
        ease: 'none',
        scrollTrigger: {
          trigger: storyShowcaseRef.current,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.7,
        },
      });
    });
    return () => media.revert();
  }, { scope: storyShowcaseRef });

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 82, behavior: 'smooth' });
  };

  const moveCursor = (event) => {
    if (!cursorRef.current || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;
    const bounds = heroRef.current.getBoundingClientRect();
    cursorRef.current.style.left = `${event.clientX - bounds.left}px`;
    cursorRef.current.style.top = `${event.clientY - bounds.top}px`;
  };

  return (
    <>
      <section id="home" className="gateway" ref={heroRef} onPointerMove={moveCursor} aria-label="Welcome to Advabliss Resort">
        <div className="gateway__backdrop" aria-hidden="true">
          <img className="gateway__pool-image" src={slidePool} alt="" fetchPriority="high" />
          <div className="gateway__lake-panel gateway__lake-panel--one"><img src={slideLakeside} alt="" /></div>
          <div className="gateway__lake-panel gateway__lake-panel--two"><img src={slideLakeside} alt="" /></div>
          <div className="gateway__lake-panel gateway__lake-panel--three"><img src={slideLakeside} alt="" /></div>
          <div className="gateway__veil" />
          <div className="gateway__gate gateway__gate--left" ref={leftGateRef}>
            <img src={slideEntrance} alt="" fetchPriority="high" />
          </div>
          <div className="gateway__gate gateway__gate--right" ref={rightGateRef}>
            <img src={slideEntrance} alt="" />
          </div>
        </div>

        <div className="gateway__copy">
          <h1>Arrive somewhere<br /><em><span className="highlight-marker">beautifully unexpected.</span></em></h1>
          <p>Step through our garden gates into a quieter pace, warm Kenyan hospitality, and days shaped by water, greenery, and good company.</p>
          <div className="gateway__actions">
            <button type="button" className="btn btn-gold" onClick={onBookNow}>Reserve your stay <ArrowUpRight size={16} /></button>
            <button type="button" className="btn btn-outline-white" onClick={() => scrollToSection('virtual-tour')}><Compass size={15} /> Explore the grounds</button>
          </div>
        </div>

        <div className="gateway__reveal-copy gateway__reveal-copy--pool" aria-hidden="true">
       
          <strong>Happy splashes<br /><em>& unforgettable family moments.</em></strong>
        </div>
        <div className="gateway__reveal-copy gateway__reveal-copy--lake" aria-hidden="true">
      
          <strong>Find your moment<br /><em>at Advabliss Resort.</em></strong>
        </div>
        <button type="button" className="gateway__scroll-cue" onClick={() => scrollToSection('sanctuary-story')} aria-label="Scroll to discover the resort">
          <span>Enter the sanctuary</span><span className="gateway__scroll-icon"><ArrowDown size={15} /></span>
        </button>
        <span className="gateway__cursor" ref={cursorRef} aria-hidden="true">Explore</span>
      </section>

      <section id="sanctuary-story" className="story aura-surface-cream section-pad">
        <div className="container">
          <div className="story__grid">
            <AnimatedContent className="story__narrative">
              <h2 className="section-title story__headline">{RESORT_STORY.headline}{' '}<em><span className="highlight-marker"><GradientText variant="dark">{RESORT_STORY.headlineAccent}</GradientText></span></em></h2>
              <p className="story__lead">{RESORT_STORY.lead}</p>
              <p className="story__body">{RESORT_STORY.body}</p>
              <div className="story__metrics">{RESORT_STORY.highlights.map((item) => <div key={item.label} className="story__metric"><span className="story__metric-val"><CountUp end={item.value} suffix={item.suffix} /></span><span className="story__metric-lbl">{item.label}</span></div>)}</div>
              <div className="story__cta-row"><button type="button" className="editorial-link" onClick={() => scrollToSection('accommodation')}><span>Explore Suites &amp; Residences</span><ArrowUpRight size={15} /></button></div>
            </AnimatedContent>
            <div className="story-showcase" ref={storyShowcaseRef} aria-label="Explore Advabliss Resort photography">
              <div className="story-showcase__stage">
                <FluidGalleryImage
                  src={STORY_PHOTOS[storyPhotoIndex].image}
                  alt={STORY_PHOTOS[storyPhotoIndex].alt}
                  imageClassName="story-showcase__image"
                  stageClassName="story-showcase__media"
                />
                <div className="story-showcase__shade" />
                <div className="story-showcase__caption" aria-live="polite">
                  <span>{STORY_PHOTOS[storyPhotoIndex].chapter}</span>
                  <h3>{STORY_PHOTOS[storyPhotoIndex].title}</h3>
                </div>
                <div className="story-showcase__arrows" aria-label="Image navigation">
                  <button type="button" onClick={() => setStoryPhotoIndex((index) => (index - 1 + STORY_PHOTOS.length) % STORY_PHOTOS.length)} aria-label="Previous resort photograph"><ChevronLeft size={19} /></button>
                  <button type="button" onClick={() => setStoryPhotoIndex((index) => (index + 1) % STORY_PHOTOS.length)} aria-label="Next resort photograph"><ChevronRight size={19} /></button>
                </div>
              </div>
              <div className="story-showcase__rail">
                <span className="story-showcase__current">{String(storyPhotoIndex + 1).padStart(2, '0')} <i>/</i> {String(STORY_PHOTOS.length).padStart(2, '0')}</span>
                <div className="story-showcase__indicators" role="tablist" aria-label="Choose a resort photograph">
                  {STORY_PHOTOS.map((photo, index) => (
                    <button
                      key={photo.id}
                      type="button"
                      role="tab"
                      aria-label={`Show ${photo.chapter} photograph`}
                      aria-selected={index === storyPhotoIndex}
                      className={index === storyPhotoIndex ? 'is-active' : ''}
                      onClick={() => setStoryPhotoIndex(index)}
                    />
                  ))}
                </div>

              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
