import React, { useEffect, useState } from 'react';
import { Phone, MessageCircle, Calendar, ArrowUp } from 'lucide-react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BookNowModal from './components/ui/BookNowModal';
import PageLoader from './components/ui/PageLoader';
import { CONTACT_INFO } from './data/siteData';

// Sections
import Hero from './components/sections/Hero';
import FeaturedEvent from './components/sections/FeaturedEvent';
import Accommodation from './components/sections/Accommodation';
import Restaurant from './components/sections/Restaurant';
import Events from './components/sections/Events';
import Activities from './components/sections/Activities';
import Offers from './components/sections/Offers';
import VirtualTour from './components/sections/VirtualTour';
import Testimonials from './components/sections/Testimonials';
import Contact from './components/sections/Contact';

export default function App() {
  const [bookModalOpen, setBookModalOpen] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);

  useEffect(() => {
    const updateVisibility = () => setShowBackToTop(window.scrollY > 400);
    updateVisibility();
    window.addEventListener('scroll', updateVisibility, { passive: true });
    return () => window.removeEventListener('scroll', updateVisibility);
  }, []);

  return (
    <div className="app">
      <PageLoader />
      <Navbar onBookNow={() => setBookModalOpen(true)} />

      <main>
        <Hero onBookNow={() => setBookModalOpen(true)} />
        <FeaturedEvent />
        <Accommodation />
        <Restaurant />
        <Events />
        <Activities />
        <Offers />
        <VirtualTour />
        <Testimonials />
        <Contact />
      </main>

      <Footer onBookNow={() => setBookModalOpen(true)} />

      <BookNowModal
        isOpen={bookModalOpen}
        onClose={() => setBookModalOpen(false)}
      />

      {showBackToTop && !bookModalOpen && (
        <button
          type="button"
          className="back-to-top"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          aria-label="Back to top"
        >
          <ArrowUp size={18} />
        </button>
      )}

      {/* Refined Non-Obstructive Mobile Bottom Action Dock */}
      <div className="mobile-action-dock" role="region" aria-label="Quick reservation actions">
        <a
          href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
          className="mobile-action-dock__icon-btn"
          aria-label={`Call ${CONTACT_INFO.phoneDisplay}`}
        >
          <Phone size={18} />
        </a>
        <a
          href={CONTACT_INFO.socials.whatsapp}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-action-dock__icon-btn"
          aria-label="Message on WhatsApp"
        >
          <MessageCircle size={18} />
        </a>
        <button
          type="button"
          className="btn btn-gold mobile-action-dock__cta"
          onClick={() => setBookModalOpen(true)}
        >
          <Calendar size={14} />
          <span>Book Your Experience</span>
        </button>
      </div>
    </div>
  );
}
