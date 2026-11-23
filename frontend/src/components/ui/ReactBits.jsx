import React, { useEffect, useRef, useState } from 'react';

function useInView({ threshold = 0.15, rootMargin = '0px 0px -40px 0px', once = true } = {}) {
  const ref = useRef(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (once) observer.unobserve(node);
        } else if (!once) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [threshold, rootMargin, once]);

  return [ref, inView];
}

/**
 * React Bits — SplitText
 * Orchestrated word-by-word entrance animation for editorial headlines.
 */
export function SplitText({
  text = '',
  className = '',
  wordClassName = '',
  delay = 45,
  as: Tag = 'span',
}) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const words = String(text).split(' ');

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, idx) => (
        <React.Fragment key={`${word}-${idx}`}>
          <span
            aria-hidden="true"
            className={`rb-split-word ${inView ? 'is-visible' : ''} ${wordClassName}`}
            style={{ transitionDelay: `${idx * delay}ms` }}
          >
            {word}
          </span>
          {idx < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/**
 * React Bits — BlurText
 * Soft focus-in word reveal for poetic subheadings and italic accents.
 */
export function BlurText({
  text = '',
  className = '',
  delay = 55,
  as: Tag = 'span',
}) {
  const [ref, inView] = useInView({ threshold: 0.1 });
  const words = String(text).split(' ');

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, idx) => (
        <React.Fragment key={`${word}-${idx}`}>
          <span
            aria-hidden="true"
            className={`rb-blur-word ${inView ? 'is-visible' : ''}`}
            style={{ transitionDelay: `${idx * delay}ms` }}
          >
            {word}
          </span>
          {idx < words.length - 1 ? ' ' : ''}
        </React.Fragment>
      ))}
    </Tag>
  );
}

/**
 * React Bits — GradientText
 * Restrained champagne-gold & warm-gold gradient typography for selected words/phrases.
 */
export function GradientText({ children, className = '', variant = 'gold' }) {
  const variantClass = variant === 'dark' ? 'rb-gradient-text--dark' : 'rb-gradient-text';
  return <span className={`${variantClass} ${className}`}>{children}</span>;
}

/**
 * React Bits — AnimatedContent / ScrollReveal
 * Smooth section & block entrance on scroll.
 */
export function AnimatedContent({
  children,
  className = '',
  delay = 0,
  threshold = 0.12,
  as: Tag = 'div',
  ...rest
}) {
  const [ref, inView] = useInView({ threshold });
  return (
    <Tag
      ref={ref}
      className={`rb-animated-content ${inView ? 'is-visible' : ''} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      {...rest}
    >
      {children}
    </Tag>
  );
}

export const ScrollReveal = AnimatedContent;

/**
 * React Bits — ScrollExpand
 * Immersive image container that subtly un-scales as it enters the viewport,
 * paired with a functional skeleton shimmer until the photograph loads.
 */
export function ScrollExpandImage({
  src,
  alt = '',
  className = '',
  imgClassName = '',
  loading = 'lazy',
  children,
}) {
  const [ref, inView] = useInView({ threshold: 0.12 });
  const [loaded, setLoaded] = useState(false);

  return (
    <div
      ref={ref}
      className={`rb-scroll-expand ${inView ? 'is-visible' : ''} ${!loaded ? 'ui-skeleton' : ''} ${className}`}
    >
      <img
        src={src}
        alt={alt}
        loading={loading}
        onLoad={() => setLoaded(true)}
        className={`rb-scroll-expand__inner ${imgClassName}`}
        style={{ opacity: loaded ? 1 : 0, transition: 'opacity 0.5s ease, transform 1.25s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />
      {children}
    </div>
  );
}

/**
 * React Bits — CountUp
 * Animated numeric counter for verified resort figures.
 */
export function CountUp({
  end = 0,
  prefix = '',
  suffix = '',
  duration = 1600,
  className = '',
}) {
  const [ref, inView] = useInView({ threshold: 0.25 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let startTime = null;
    let animId = null;

    const step = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.round(eased * end));
      if (progress < 1) {
        animId = window.requestAnimationFrame(step);
      }
    };

    animId = window.requestAnimationFrame(step);
    return () => {
      if (animId) window.cancelAnimationFrame(animId);
    };
  }, [inView, end, duration]);

  return (
    <span ref={ref} className={className}>
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}
