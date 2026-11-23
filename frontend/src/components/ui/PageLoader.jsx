import React, { useState, useEffect } from 'react';
import logo from '../images/logo.webp';
import './PageLoader.css';

export default function PageLoader() {
  const [isVisible, setIsVisible] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    let fadeTimer = null;
    let removeTimer = null;

    const handleReady = () => {
      // Brief, polished delay so loader is recognizable without causing perceptible lag
      fadeTimer = setTimeout(() => {
        setIsFadingOut(true);
        removeTimer = setTimeout(() => {
          setIsVisible(false);
        }, 450);
      }, 400);
    };

    if (document.readyState === 'complete') {
      handleReady();
    } else {
      window.addEventListener('load', handleReady, { once: true });
    }

    // Safety timeout: never hang indefinitely
    const fallbackTimer = setTimeout(handleReady, 1100);

    return () => {
      window.removeEventListener('load', handleReady);
      clearTimeout(fadeTimer);
      clearTimeout(removeTimer);
      clearTimeout(fallbackTimer);
    };
  }, []);

  if (!isVisible) return null;

  return (
    <div
      className={`page-loader ${isFadingOut ? 'page-loader--fade-out' : ''}`}
      role="status"
      aria-live="polite"
      aria-label="Loading AdvaBliss Resort Ruiru"
    >
      <div className="page-loader__content">
        {/* Emblem Lockup with Concentric Gold Spinner Ring */}
        <div className="page-loader__emblem-wrap">
          {/* Refined continuous rotating gold spinner ring */}
          <div className="page-loader__spinner" aria-hidden="true" />

          {/* Ambient glow halo behind emblem */}
          <div className="page-loader__halo" aria-hidden="true" />

          {/* Authentic Local AdvaBliss Logo Crest */}
          <div className="page-loader__logo-box">
            <img
              src={logo}
              alt="AdvaBliss Resort Ruiru Emblem"
              className="page-loader__logo-img"
              width="64"
              height="64"
            />
          </div>
        </div>

        {/* Brand Text Lockup */}
        <div className="page-loader__brand">
          <span className="page-loader__brand-title">AdvaBliss</span>
          <span className="page-loader__brand-sub">Resort in Ruiru</span>
        </div>

        {/* Elegant Loading Caption in Montserrat */}
        <div className="page-loader__caption">
          <span className="page-loader__caption-text">Preparing your experience</span>
          <span className="page-loader__dots" aria-hidden="true">
            <span className="dot dot--1">.</span>
            <span className="dot dot--2">.</span>
            <span className="dot dot--3">.</span>
          </span>
        </div>
      </div>
    </div>
  );
}
