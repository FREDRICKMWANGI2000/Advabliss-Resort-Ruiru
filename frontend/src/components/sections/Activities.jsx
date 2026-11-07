import React, { useState } from 'react';
import {
  Clock,
  Users,
  Compass,
  Wind,
  Trees,
  Smile,
  Anchor,
  ArrowUpRight,
  Sparkles,
  Waves,
  ShieldCheck,
  Flag,
} from 'lucide-react';
import { ACTIVITIES } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
import './Activities.css';
import ropeBridgeImg from '../images/rope-bridge.webp';
import resortPoolImg from '../images/resort-pool.webp';

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

  const scrollToContact = () => {
    const el = document.getElementById('contact');
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 82,
        behavior: 'smooth',
      });
    }
  };

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

        {/* Dedicated Swimming & Pool Showcase */}
        <AnimatedContent className="activities__pool-showcase aura-surface-dark" id="activities-pool">
          <div className="activities__pool-media">
            <ScrollExpandImage
              src={resortPoolImg}
              alt="Authentic Swimming Pool and Tiled Sun Deck at AdvaBliss Resort Ruiru"
              className="activities__pool-img-wrap"
            />
            <div className="activities__pool-badge">
              <Waves size={15} />
              <span>Authentic Resort Pool &amp; Grounds</span>
            </div>
          </div>

          <div className="activities__pool-copy">
            <span className="section-eyebrow light">Aquatic Leisure &amp; Wellness</span>
            <h3 className="activities__pool-title">
              Crystal Waters Beneath the{' '}
              <em>
                <GradientText>Ruiru Pines</GradientText>
              </em>
            </h3>
            <p className="activities__pool-desc">
              Framed by mature evergreen trees and landscaped lawns, our sparkling outdoor swimming pool offers a refreshing sanctuary for leisurely morning laps, sun-soaked afternoon lounging, and family cooling off under clear Kenyan skies.
            </p>

            <div className="activities__pool-features">
              <div className="activities__pool-feature">
                <div className="activities__pool-feature-icon">
                  <Waves size={16} />
                </div>
                <div>
                  <strong>Outdoor Resort Swimming Pool</strong>
                  <p>Clean, chlorinated crystal waters with designated shallow and deep sections.</p>
                </div>
              </div>
              <div className="activities__pool-feature">
                <div className="activities__pool-feature-icon">
                  <Sparkles size={16} />
                </div>
                <div>
                  <strong>Tiled Sun Lounger Deck</strong>
                  <p>Spacious pool terrace with comfortable sun chairs for relaxing between swims.</p>
                </div>
              </div>
              <div className="activities__pool-feature">
                <div className="activities__pool-feature-icon">
                  <ShieldCheck size={16} />
                </div>
                <div>
                  <strong>Dedicated Changing Cabanas</strong>
                  <p>Convenient private changing rooms and freshwater rinse stations poolside.</p>
                </div>
              </div>
            </div>

            <div className="activities__pool-actions">
              <button
                type="button"
                className="btn btn-gold"
                onClick={scrollToContact}
              >
                <span>Enquire for Pool Access &amp; Day Visits</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>
        </AnimatedContent>

        {/* All-Day Activities Pass Editorial Banner */}
        <AnimatedContent className="activities__bundle aura-surface-dark">
          <div className="activities__bundle-left">
            <span className="section-eyebrow light">All-Access Day Pass</span>
            <h3 className="activities__bundle-title">
              Full-Day Adventure{' '}
              <em>
                <GradientText>Pass</GradientText>
              </em>
            </h3>
            <p className="activities__bundle-desc">
              Enjoy unlimited full-day access across our resort grounds and signature outdoor activities — ideal for weekend family outings, school groups, and team-building retreats in Ruiru.
            </p>

            <div className="activities__bundle-pricing">
              <div className="activities__bundle-price-block">
                <span className="activities__bundle-original">KES 2,000</span>
                <span className="activities__bundle-sale">KES 1,500</span>
                <span className="activities__bundle-per">/ person</span>
              </div>

              <button
                type="button"
                className="btn btn-gold"
                onClick={scrollToContact}
              >
                <span>Enquire for Group &amp; Day Passes</span>
                <ArrowUpRight size={15} />
              </button>
            </div>
          </div>

          <div className="activities__bundle-right">
            <div className="activities__bundle-photo-wrap">
              <img
                src={ropeBridgeImg}
                alt="AdvaBliss Resort Rope Bridge and Day Pass Experience"
                className="activities__bundle-photo"
                loading="lazy"
              />
            </div>

            <div className="activities__bundle-list">
              {ACTIVITIES.map((a) => {
                const IconComp = ACTIVITY_ICON_MAP[a.iconName] || Sparkles;
                return (
                  <div key={a.name} className="activities__bundle-pill">
                    <IconComp size={15} />
                    <span>{a.name}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </AnimatedContent>
      </div>
    </section>
  );
}
