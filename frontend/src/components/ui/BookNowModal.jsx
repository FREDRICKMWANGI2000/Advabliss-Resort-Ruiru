import React, { useEffect } from 'react';
import { X, BedDouble, UtensilsCrossed, CalendarHeart, Compass, ArrowUpRight, Phone } from 'lucide-react';
import { CONTACT_INFO, formatKSh } from '../../data/siteData';
import './BookNowModal.css';

const ICON_MAP = {
  accommodation: BedDouble,
  restaurant: UtensilsCrossed,
  events: CalendarHeart,
  activities: Compass,
};

export default function BookNowModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    const handleKey = (e) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleKey);
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const scrollTo = (id) => {
    onClose();
    setTimeout(() => {
      const el = document.getElementById(id);
      if (el) {
        window.scrollTo({
          top: el.getBoundingClientRect().top + window.scrollY - 82,
          behavior: 'smooth',
        });
      }
    }, 180);
  };

  const options = [
    {
      title: 'Rooms & Luxury Suites',
      desc: 'Reserve a Garden View Room, Deluxe Suite, Family Suite, or Event Stay',
      meta: `From ${formatKSh(3500)} / night`,
      section: 'accommodation',
    },
    {
      title: 'Restaurant & Garden Bar',
      desc: 'Reserve an indoor table or al fresco terrace dining experience',
      meta: 'Lunch, Dinner & Sundowners',
      section: 'restaurant',
    },
    {
      title: 'Weddings, Meetings & Events',
      desc: 'Enquire for weddings, corporate retreats, private parties, or garden hire',
      meta: '10 to 1,000 guests',
      section: 'events',
    },
    {
      title: 'Games & Outdoor Activities',
      desc: 'Explore canopy rope bridges, ziplining, boat rides & all-day passes',
      meta: `Day Pass ${formatKSh(1500)} / person`,
      section: 'activities',
    },
  ];

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-labelledby="book-modal-title"
    >
      <div className="modal aura-surface-cream" onClick={(e) => e.stopPropagation()}>
        <button
          type="button"
          className="modal__close"
          onClick={onClose}
          aria-label="Close reservation dialog"
        >
          <X size={18} />
        </button>

        <div className="modal__header">
          <h2 id="book-modal-title" className="modal__title">
            Begin Your <em>Reservation</em>
          </h2>
          <p className="modal__sub">
            Select the experience you wish to arrange and our team will guide you directly to the reservation desk.
          </p>
        </div>

        <div className="modal__options">
          {options.map((opt) => {
            const IconComponent = ICON_MAP[opt.section] || BedDouble;
            return (
              <button
                type="button"
                key={opt.section}
                className="modal__option"
                onClick={() => scrollTo(opt.section)}
              >
                <span className="modal__option-icon">
                  <IconComponent size={20} strokeWidth={1.6} />
                </span>
                <div className="modal__option-body">
                  <div className="modal__option-top">
                    <span className="modal__option-title">{opt.title}</span>
                    <span className="modal__option-meta">{opt.meta}</span>
                  </div>
                  <div className="modal__option-desc">{opt.desc}</div>
                </div>
                <ArrowUpRight size={18} className="modal__option-arrow" />
              </button>
            );
          })}
        </div>

        <div className="modal__footer">
          <span>Prefer immediate assistance?</span>
          <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="modal__tel">
            <Phone size={13} />
            <span>{CONTACT_INFO.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
