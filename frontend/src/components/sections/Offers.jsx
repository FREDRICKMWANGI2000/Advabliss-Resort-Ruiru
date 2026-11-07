import React, { useState } from 'react';
import {
  Check,
  Tag,
  ArrowUpRight,
  Mail,
  CheckCircle2,
  AlertCircle,
  Clock,
} from 'lucide-react';
import { OFFERS } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
import './Offers.css';

export default function Offers() {
  const [subEmail, setSubEmail] = useState('');
  const [subLoading, setSubLoading] = useState(false);
  const [subStatus, setSubStatus] = useState(null); // { type: 'success'|'error', text: '' }

  const scrollToBooking = (offerId) => {
    const targetId =
      offerId === 'wedding-dream' || offerId === 'business-leisure'
        ? 'events'
        : 'accommodation';
    const el = document.getElementById(targetId);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 82,
        behavior: 'smooth',
      });
    }
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    setSubStatus(null);

    if (!subEmail.trim() || !/\S+@\S+\.\S+/.test(subEmail)) {
      setSubStatus({
        type: 'error',
        text: 'Please enter a valid email address to subscribe.',
      });
      return;
    }

    setSubLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const res = await fetch(`${apiBase}/api/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: subEmail }),
      });

      if (res.ok) {
        setSubStatus({
          type: 'success',
          text: `Thank you! ${subEmail} has been added to our private privileges list.`,
        });
        setSubEmail('');
      } else {
        setSubStatus({
          type: 'error',
          text: 'Subscription could not be completed at this moment. Please try again shortly.',
        });
      }
    } catch (err) {
      console.error(err);
      setSubStatus({
        type: 'error',
        text: 'Unable to reach our subscription service right now.',
      });
    } finally {
      setSubLoading(false);
    }
  };

  return (
    <section id="offers" className="offers aura-surface-dark aura-grain section-pad">
      <div className="container offers__inner">
        {/* Editorial Split Header */}
        <div className="editorial-header-split light">
          <div>
            <span className="section-eyebrow light">Curated Privileges</span>
            <h2 className="section-title light">
              <SplitText text="Seasonal Packages &" delay={45} />{' '}
              <em>
                <GradientText>Bespoke Bundles</GradientText>
              </em>
            </h2>
          </div>
          <p className="section-subtitle light">
            Thoughtfully paired stays, dining experiences, executive retreats, and wedding celebrations offering exceptional value at AdvaBliss Resort.
          </p>
        </div>

        {/* Editorial Alternating Offer Showcases */}
        <div className="offers__list">
          {OFFERS.map((offer, i) => (
            <AnimatedContent
              key={offer.title}
              delay={i * 75}
              className={`offers__row ${i % 2 === 1 ? 'offers__row--reverse' : ''}`}
            >
              <div className="offers__media">
                <ScrollExpandImage
                  src={offer.image}
                  alt={offer.title}
                  className="offers__img"
                />
                <span className="offers__badge">{offer.badge}</span>
                <span className="offers__tag-chip">
                  <Tag size={11} />
                  <span>{offer.tag}</span>
                </span>
              </div>

              <div className="offers__body">
                <div className="offers__validity-line">
                  <Clock size={13} />
                  <span>{offer.validity}</span>
                </div>

                <h3 className="offers__title">{offer.title}</h3>
                <p className="offers__desc">{offer.desc}</p>

                <div className="offers__includes">
                  <div className="offers__includes-title">Package Inclusions</div>
                  <ul className="offers__includes-list">
                    {offer.includes.map((inc) => (
                      <li key={inc}>
                        <Check size={13} />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="offers__footer">
                  <div className="offers__pricing">
                    <span className="offers__price-label">Package Tariff</span>
                    <div className="offers__price-values">
                      <span className="offers__original">${offer.originalPrice}</span>
                      <span className="offers__sale">${offer.salePrice}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    className="btn btn-gold offers__cta"
                    onClick={() => scrollToBooking(offer.id)}
                  >
                    <span>Enquire &amp; Reserve</span>
                    <ArrowUpRight size={15} />
                  </button>
                </div>
              </div>
            </AnimatedContent>
          ))}
        </div>
        
      </div>
    </section>
  );
}
