import React, { useState } from 'react';
import {
  Clock,
  Users,
  Compass,
  Wind,
  Trees,
  Smile,
  Anchor,
  Waves,
  Flag,
} from 'lucide-react';
import { ACTIVITIES } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
import './Activities.css';

const ACTIVITY_ICON_MAP = {
  Compass,
  Wind,
  Trees,
  Smile,
  Anchor,
  Waves,
  Flag,
};

export default function Activities() {
  const [activeIndex, setActiveIndex] = useState(0);

  return (
    <section id="activities" className="activities aura-surface-warm section-pad">
      <div className="container">
        {/* Editorial Split Header */}
        <div className="editorial-header-split">
          <div>
            <span className="section-eyebrow">Games &amp; Outdoor Pursuits</span>
            <h2 className="section-title">
              <SplitText text="Canopy Trails &" delay={45} />{' '}
              <em>
                <GradientText variant="dark">Waterside Leisure</GradientText>
              </em>
            </h2>
          </div>
          <p className="section-subtitle">
            Whether crossing our elevated wooden suspension bridge through the trees, soaring along the zipline, or gliding across the calm lake waters, AdvaBliss brings adventure to every generation.
          </p>
        </div>

        {/* Asymmetrical Editorial Activity Showcase */}
        <div className="activities__showcase">
          {ACTIVITIES.map((act, i) => {
            const IconComp = ACTIVITY_ICON_MAP[act.iconName] || Flag;
            const isFeatured = Boolean(act.featured || i === 0);
            const isSelected = activeIndex === i;

            return (
              <AnimatedContent
                key={act.id || act.name}
                id={`activity-${act.id}`}
                delay={i * 65}
                className={`activities__item ${
                  isFeatured ? 'activities__item--featured' : ''
                } ${isSelected ? 'activities__item--active' : ''}`}
              >
                <div
                  className="activities__item-inner"
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => setActiveIndex(i)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      setActiveIndex(i);
                    }
                  }}
                >
                  <div className="activities__media">
                    <ScrollExpandImage
                      src={act.image}
                      alt={act.name}
                      className="activities__img"
                    />
                    <span className="activities__index">{String(i + 1).padStart(2, '0')}</span>
                  </div>

                  <div className="activities__copy">
                    <div className="activities__kicker">
                      <IconComp size={14} strokeWidth={1.75} />
                      <span>Outdoor Experience</span>
                    </div>

                    <h3 className="activities__name">{act.name}</h3>
                    <p className="activities__desc">{act.desc}</p>

                    {(act.duration || act.ageMin || act.price) && (
                      <div className="activities__meta">
                        {act.duration && (
                          <span>
                            <Clock size={13} />
                            {act.duration}
                          </span>
                        )}
                        {act.ageMin && (
                          <span>
                            <Users size={13} />
                            Ages {act.ageMin}+
                          </span>
                        )}
                        {act.price && (
                          <span className="activities__price-tag">${act.price} / session</span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>
      </div>
    </section>
  );
}
