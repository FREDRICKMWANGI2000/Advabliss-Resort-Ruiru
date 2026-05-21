import React, { useState } from 'react';
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import BookNowModal from './components/ui/BookNowModal';

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

  return (
    <div className="app">
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

      {/* Persistent floating Book Now button (mobile) */}
      <button
        className="floating-book-btn"
        onClick={() => setBookModalOpen(true)}
        aria-label="Book Now"
      >
        Book Now
      </button>
    </div>
  );
}
