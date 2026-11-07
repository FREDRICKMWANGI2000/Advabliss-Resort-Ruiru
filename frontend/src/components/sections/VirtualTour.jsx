import React, { useState, useEffect, useCallback } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Maximize2,
  X,
  Calendar,
  Compass,
  ArrowUpRight,
} from 'lucide-react';
import { TOUR_SPACES } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent } from '../ui/ReactBits';
import FluidGalleryImage from '../ui/FluidGalleryImage';
import './VirtualTour.css';

export default function VirtualTour() {
  const [active, setActive] = useState(0);
  const [lightbox, setLightbox] = useState(false);

  const prev = useCallback(() => {
    setActive((a) => (a - 1 + TOUR_SPACES.length) % TOUR_SPACES.length);
  }, []);

  const next = useCallback(() => {
    setActive((a) => (a + 1) % TOUR_SPACES.length);
  }, []);

  // Keyboard navigation in lightbox
  useEffect(() => {
    if (!lightbox) return;
    const handleKey = (e) => {
      if (e.key === 'Escape') setLightbox(false);
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [lightbox, prev, next]);

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 82,
        behavior: 'smooth',
      });
    }
  };

  const space = TOUR_SPACES[active];

  return (
    <section id="virtual-tour" className="virtual-tour aura-surface-cream section-pad">
      <div className="container">
        {/* Editorial Split Header */}
        <div className="editorial-header-split">
          <div>
            <span className="section-eyebrow">Visual Gallery</span>
            <h2 className="section-title">
              <SplitText text="Journey Through" delay={45} />{' '}
              <em>
                <GradientText variant="dark">AdvaBliss</GradientText>
              </em>
            </h2>
          </div>
          <p className="section-subtitle">
            Explore our manicured courtyard gardens, lakeside seating, woodland rope bridges, suites, and dining terraces before your arrival in Ruiru.
          </p>
        </div>

        {/* Main Gallery Stage */}
        <AnimatedContent className="vt__main">
          <div className="vt__viewer">
            <FluidGalleryImage
              src={space.image}
              alt={space.name}
              imageClassName="vt__viewer-img"
              stageClassName="vt__image-stage--viewer"
              active={!lightbox}
            />
            <div className="vt__viewer-overlay">
              <div className="vt__viewer-info">
                <span className="vt__viewer-kicker">
                  0{active + 1} / 0{TOUR_SPACES.length} · {space.category || 'Resort Grounds'}
                </span>
                <h3 className="vt__viewer-name">{space.name}</h3>
                <p className="vt__viewer-desc">{space.desc}</p>
              </div>

              <button
                type="button"
                className="vt__viewer-expand"
                onClick={() => setLightbox(true)}
                aria-label="Open fullscreen gallery view"
              >
                <Maximize2 size={18} />
              </button>
            </div>

            <button
              type="button"
              className="vt__nav vt__nav--prev"
              onClick={prev}
              aria-label="Previous gallery space"
            >
              <ChevronLeft size={20} />
            </button>

            <button
              type="button"
              className="vt__nav vt__nav--next"
              onClick={next}
              aria-label="Next gallery space"
            >
              <ChevronRight size={20} />
            </button>
          </div>

          {/* Chapter Index & Thumbnails */}
          <div className="vt__thumbs" role="tablist" aria-label="Resort spaces">
            {TOUR_SPACES.map((s, i) => (
              <button
                type="button"
                role="tab"
                aria-selected={i === active}
                key={s.id}
                className={`vt__thumb ${i === active ? 'vt__thumb--active' : ''}`}
                onClick={() => setActive(i)}
              >
                <img src={s.thumb} alt={s.name} loading="lazy" className="vt__thumb-img" />
                <div className="vt__thumb-meta">
                  <span className="vt__thumb-idx">0{i + 1}</span>
                  <span className="vt__thumb-name">{s.name}</span>
                </div>
              </button>
            ))}
          </div>
        </AnimatedContent>

        {/* Site Visit CTA Bar */}
        <AnimatedContent className="vt__cta-bar aura-surface-dark">
          <div className="vt__cta-text">
            <span className="section-eyebrow light">Private Walkthrough</span>
            <h4>Experience the Grounds in Person</h4>
            <p>
              Arrange a complimentary guided site visit with our hospitality and events team in Ruiru.
            </p>
          </div>
          <div className="vt__cta-actions">
            <button
              type="button"
              className="btn btn-gold"
              onClick={() => scrollToSection('contact')}
            >
              <Compass size={15} />
              <span>Schedule a Site Visit</span>
            </button>
            <button
              type="button"
              className="btn btn-outline-gold-light"
              onClick={() => scrollToSection('accommodation')}
            >
              <Calendar size={15} />
              <span>Reserve a Stay</span>
              <ArrowUpRight size={14} />
            </button>
          </div>
        </AnimatedContent>
      </div>

      {/* Accessible Lightbox Dialog */}
      {lightbox && (
        <div
          className="vt__lightbox"
          onClick={() => setLightbox(false)}
          role="dialog"
          aria-modal="true"
          aria-label={space.name}
        >
          <button
            type="button"
            className="vt__lightbox-close"
            onClick={() => setLightbox(false)}
            aria-label="Close fullscreen gallery"
          >
            <X size={20} />
          </button>

          <button
            type="button"
            className="vt__nav vt__nav--prev"
            onClick={(e) => {
              e.stopPropagation();
              prev();
            }}
            aria-label="Previous image"
          >
            <ChevronLeft size={22} />
          </button>

          <FluidGalleryImage
            src={space.image}
            alt={space.name}
            imageClassName="vt__lightbox-img"
            stageClassName="vt__image-stage--lightbox"
            fit="contain"
            active={lightbox}
            onClick={(e) => e.stopPropagation()}
          />

          <button
            type="button"
            className="vt__nav vt__nav--next"
            onClick={(e) => {
              e.stopPropagation();
              next();
            }}
            aria-label="Next image"
          >
            <ChevronRight size={22} />
          </button>

          <div className="vt__lightbox-caption" onClick={(e) => e.stopPropagation()}>
            <strong>{space.name}</strong> — {space.desc}
          </div>
        </div>
      )}
    </section>
  );
}
