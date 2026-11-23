import React, { useState } from 'react';
import { EVENT_TYPES, EVENT_ADDONS, CONTACT_INFO, formatKSh } from '../../data/siteData';
import { SplitText, GradientText } from '../ui/ReactBits';
import './Events.css';
import lakesideImg from '../images/lakeside-seating.webp';
import gardenBanquetImg from '../images/garden-banquet.webp';
import gardenDiningImg from '../images/garden-dining.png';
import poolImg from '../images/resort-pool.webp';
import entranceImg from '../images/advabliss-entrance.webp';

const CATEGORY_IMAGES = {
  wedding: gardenBanquetImg,
  corporate: gardenDiningImg,
  private: poolImg,
  garden: entranceImg,
};

const article = (name) => (/^[AEIOU]/i.test(name) ? 'an' : 'a');

export default function Events() {
  const [activeId, setActiveId] = useState(EVENT_TYPES[0].id);
  const current = EVENT_TYPES.find((t) => t.id === activeId) || EVENT_TYPES[0];

  // Singular label for the message, e.g. "Private Parties" -> "Private Party"
  const singular = { wedding: 'Wedding', corporate: 'Corporate Event', private: 'Private Party', garden: 'Garden Hire' }[current.id];

  const message = `Hello Advabliss Resort, I would like to enquire about hosting ${article(singular)} ${singular} at your venue. Please share more information.`;
  const whatsappHref = `${CONTACT_INFO.socials.whatsapp}?text=${encodeURIComponent(message)}`;
  const telHref = `tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`;
  const mailHref = `mailto:${CONTACT_INFO.email}?subject=${encodeURIComponent(`Event enquiry — ${current.name}`)}&body=${encodeURIComponent(message)}`;

  return (
    <section id="events" className="events aura-surface-cream">
      <div className="container events__body section-pad">
        <header className="events__intro">
          <h2 className="section-title">
            <SplitText text="Gather beneath" delay={45} />{' '}
            <em>
              <span className="highlight-marker"><GradientText>open skies</GradientText></span>
            </em>
          </h2>
          <p className="section-subtitle">
            Weddings, corporate gatherings and private celebrations, hosted across the gardens and lakeside of AdvaBliss Resort in Ruiru.
          </p>
        </header>

        <div className="events__tabs" role="tablist" aria-label="Event categories">
          {EVENT_TYPES.map((type) => (
            <button
              key={type.id}
              type="button"
              role="tab"
              id={`events-tab-${type.id}`}
              aria-selected={type.id === activeId}
              aria-controls="events-panel"
              className={`events__tab ${type.id === activeId ? 'events__tab--active' : ''}`}
              onClick={() => setActiveId(type.id)}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div
          className="events__panel"
          id="events-panel"
          role="tabpanel"
          aria-labelledby={`events-tab-${current.id}`}
          key={current.id}
        >
          <figure className="events__photo">
            <img src={CATEGORY_IMAGES[current.id]} alt={`${current.name} at AdvaBliss Resort`} loading="lazy" />
          </figure>

          <div className="events__detail">
            <p className="events__capacity">{current.capacity}</p>
            <h3>{current.name}</h3>
            <p className="events__desc">{current.desc}</p>
            <ul className="events__venue">
              {current.highlights.map((h) => (
                <li key={h}>{h}</li>
              ))}
            </ul>

            <div className="events__cta">
              <a className="btn btn-gold" href={mailHref}>
                Enquire About Your Event
              </a>
              <a className="btn btn-outline-gold events__btn-dark" href={whatsappHref} target="_blank" rel="noopener noreferrer">
                WhatsApp Us
              </a>
              <a className="events__call" href={telHref}>
                or call {CONTACT_INFO.phone}
              </a>
            </div>
          </div>
        </div>

        <section className="events__services" aria-labelledby="events-services-title">
          <div className="events__services-head">
            <h3 id="events-services-title">Event services</h3>
            <p>Add these to any occasion. Mention the ones you are interested in when you enquire.</p>
          </div>
          <ul className="events__service-list">
            {EVENT_ADDONS.map((a) => (
              <li key={a.id}>
                <span>{a.name}</span>
                <span className="events__service-dots" aria-hidden="true" />
                <span className="events__service-price">{formatKSh(a.price)}</span>
              </li>
            ))}
          </ul>
        </section>
      </div>
    </section>
  );
}
