import React from 'react';
import { ArrowUpRight } from 'lucide-react';
import { OFFERS } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
import './Offers.css';

export default function Offers() {
  const scrollToBooking = (offerId) => {
    const targetId = offerId === 'business-leisure' ? 'events' : 'accommodation-form';
    const el = document.getElementById(targetId);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 82,
        behavior: 'smooth',
      });
    }
  };


  return (
    <section id="offers" className="offers aura-surface-dark aura-grain section-pad">
      <div className="container offers__inner">
        {/* Editorial Split Header */}
        <div className="editorial-header-split light">
          <div>
            <h2 className="section-title light">
              <SplitText text="Resort Experiences &" delay={45} />{' '}
              <em>
                <span className="highlight-marker"><GradientText>Packages</GradientText></span>
              </em>
            </h2>
          </div>
          <p className="section-subtitle light">
            Explore stays, family leisure, and corporate gatherings at AdvaBliss Resort.
          </p>
        </div>

        {/* Three resort packages */}
        <div className="offers__list">
          {OFFERS.slice(0, 3).map((offer, i) => (
            <AnimatedContent
              key={offer.title}
              delay={i * 75}
              className="offers__row"
            >
              <div className="offers__media">
                <ScrollExpandImage
                  src={offer.image}
                  alt={offer.title}
                  className="offers__img"
                />
              </div>

              <div className="offers__body">
                <h3 className="offers__title">{offer.title}</h3>
                <p className="offers__desc">{offer.desc}</p>

                <div className="offers__footer">
                  <div className="offers__pricing">
                    <span className="offers__price-label">Package pricing</span>
                    <div className="offers__sale">Price on enquiry</div>
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
