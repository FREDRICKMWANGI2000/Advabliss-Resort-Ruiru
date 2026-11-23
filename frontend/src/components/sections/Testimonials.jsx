import React, { useState, useEffect } from 'react';
import { Star, Quote } from 'lucide-react';
import { TESTIMONIALS } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent } from '../ui/ReactBits';
import './Testimonials.css';

export default function Testimonials() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const t = setInterval(
      () => setActive((a) => (a + 1) % TESTIMONIALS.length),
      6000
    );
    return () => clearInterval(t);
  }, []);

  return (
    <section className="testimonials aura-surface-dark aura-grain section-pad">
      <div className="container testimonials__inner">
        <div className="section-header center">
          <h2 className="section-title light">
            <SplitText text="Words From Those" delay={45} />{' '}
            <em>
              <span className="highlight-marker"><GradientText>We Have Hosted</GradientText></span>
            </em>
          </h2>
        </div>

        {/* Editorial 3-Column Guest Voices Ledger */}
        <div className="testimonials__grid">
          {TESTIMONIALS.map((t, i) => {
            const isHighlighted = i === active;
            return (
              <AnimatedContent
                key={t.name}
                delay={i * 90}
                className={`testimonials__card ${
                  isHighlighted ? 'testimonials__card--active' : ''
                }`}
              >
                <div
                  className="testimonials__card-inner"
                  onClick={() => setActive(i)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActive(i);
                    }
                  }}
                >
                  <div className="testimonials__top">
                    <Quote size={24} className="testimonials__quote-icon" />
                    <div className="testimonials__stars" aria-label={`${t.rating} out of 5 stars`}>
                      {Array.from({ length: t.rating }).map((_, s) => (
                        <Star key={s} size={14} fill="currentColor" />
                      ))}
                    </div>
                  </div>

                  <p className="testimonials__text">“{t.text}”</p>

                  <div className="testimonials__author">
                    <div className="testimonials__monogram" aria-hidden="true">
                      {t.initials || t.name.slice(0, 2).toUpperCase()}
                    </div>
                    <div>
                      <div className="testimonials__name">{t.name}</div>
                      <div className="testimonials__occasion">{t.occasion}</div>
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        <div className="testimonials__dots" role="tablist" aria-label="Highlight guest review">
          {TESTIMONIALS.map((t, i) => (
            <button
              type="button"
              key={t.name}
              role="tab"
              aria-selected={i === active}
              aria-label={`Highlight review by ${t.name}`}
              className={`testimonials__dot ${
                i === active ? 'testimonials__dot--active' : ''
              }`}
              onClick={() => setActive(i)}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
