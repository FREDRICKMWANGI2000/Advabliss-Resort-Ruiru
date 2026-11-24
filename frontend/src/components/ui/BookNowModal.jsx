import React, { useEffect } from 'react';
import { X, Phone } from 'lucide-react';
import { CONTACT_INFO } from '../../data/siteData';
import './BookNowModal.css';

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
      title: 'Rooms & suites',
      section: 'accommodation',
    },
    {
      title: 'Restaurant & bar',
      section: 'restaurant',
    },
    {
      title: 'Events',
      section: 'events',
    },
    {
      title: 'Activities',
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
            Make a <em>booking</em>
          </h2>
          <p className="modal__sub">
            What would you like to book? Choose an option to get started.
          </p>
        </div>

        <div className="modal__options">
          {options.map((opt) => {
            return (
              <button
                type="button"
                key={opt.section}
                className="modal__option"
                onClick={() => scrollTo(opt.section)}
              >
                <span className="modal__option-title">{opt.title}</span>
              </button>
            );
          })}
        </div>

        <div className="modal__footer">
          <span>Need help? Call us</span>
          <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="modal__tel">
            <Phone size={13} />
            <span>{CONTACT_INFO.phoneDisplay}</span>
          </a>
        </div>
      </div>
    </div>
  );
}
