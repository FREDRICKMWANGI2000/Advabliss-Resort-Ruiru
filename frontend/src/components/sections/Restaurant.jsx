import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Utensils,
  Wine,
  Sun,
  Clock,
  Users,
  Send,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  MapPin,
  Calendar,
  UtensilsCrossed,
  ShieldCheck,
  ArrowUpRight,
  Coffee,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Flame,
  X,
  Maximize2,
} from 'lucide-react';
import gsap from 'gsap';
import { FEATURED_DISHES, MENU_CATEGORIES, formatKSh, CONTACT_INFO } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
import './Restaurant.css';

import tableImg from '../images/table.webp';
import gardenDiningImg from '../images/garden-dining.png';
import lakesideSeatingImg from '../images/lakeside-seating.webp';

import axios from 'axios';

const CATEGORY_ICON_MAP = {
  starters: Utensils,
  mains: UtensilsCrossed,
  desserts: Sparkles,
  drinks: Wine,
};

export default function Restaurant() {
  // Showcase Carousel State
  const [activeSlide, setActiveSlide] = useState(0);
  const [touchStartX, setTouchStartX] = useState(null);

  // Complete Dining Menu State
  const [isMenuExpanded, setIsMenuExpanded] = useState(true);
  const [activeMenuTab, setActiveMenuTab] = useState('starters');
  const [lightboxIndex, setLightboxIndex] = useState(null);

  // Table Reservation Form State
  const [loading, setLoading] = useState(false);
  const [resForm, setResForm] = useState({
    name: '',
    seatingArea: 'The Garden Room & Gazebos',
    date: '',
    time: '19:00',
    guests: '2',
    phone: '',
    email: '',
    occasion: 'None',
    requests: '',
  });
  const [resErrors, setResErrors] = useState({});
  const [confirmedReservation, setConfirmedReservation] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const dishContentRef = useRef(null);
  const fullMenuSectionRef = useRef(null);
  const menuGridRef = useRef(null);

  const totalSlides = FEATURED_DISHES.length;
  const currentDish = FEATURED_DISHES[activeSlide] || FEATURED_DISHES[0];

  // Carousel navigation callbacks
  const nextSlide = useCallback(() => {
    setActiveSlide((prev) => (prev + 1) % totalSlides);
  }, [totalSlides]);

  const prevSlide = useCallback(() => {
    setActiveSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  }, [totalSlides]);

  const goToSlide = useCallback((index) => {
    setActiveSlide(index);
  }, []);

  // GSAP animation for text updates on slide change
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReduced && dishContentRef.current) {
      gsap.fromTo(
        dishContentRef.current.children,
        { opacity: 0, y: 15 },
        { opacity: 1, y: 0, duration: 0.42, stagger: 0.05, ease: 'power2.out' }
      );
    }
  }, [activeSlide]);

  // Keyboard navigation for carousel
  const handleKeyDown = (e) => {
    if (e.key === 'ArrowRight') {
      nextSlide();
    } else if (e.key === 'ArrowLeft') {
      prevSlide();
    }
  };

  // Touch swipe support for mobile
  const handleTouchStart = (e) => {
    setTouchStartX(e.touches[0].clientX);
  };

  const handleTouchEnd = (e) => {
    if (touchStartX === null) return;
    const touchEndX = e.changedTouches[0].clientX;
    const diff = touchStartX - touchEndX;
    if (diff > 45) {
      nextSlide();
    } else if (diff < -45) {
      prevSlide();
    }
    setTouchStartX(null);
  };

  // Toggle full menu and smoothly scroll if expanding
  const handleToggleMenu = () => {
    const nextState = !isMenuExpanded;
    setIsMenuExpanded(nextState);
    if (nextState && fullMenuSectionRef.current) {
      setTimeout(() => {
        fullMenuSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }, 150);
    }
  };

  // Table reservation form helpers
  const setField = (k, v) => {
    setResForm((p) => ({ ...p, [k]: v }));
    if (resErrors[k]) {
      setResErrors((p) => ({ ...p, [k]: null }));
    }
  };

  const validateRes = () => {
    const e = {};
    if (!resForm.name.trim()) e.name = 'Full name is required';
    if (!resForm.date) e.date = 'Reservation date is required';
    if (!resForm.time) e.time = 'Preferred time is required';
    if (!resForm.phone.trim()) e.phone = 'Phone number is required';
    else if (!/^(?:(?:\+254|0)[17]\d{8})$/.test(resForm.phone.replace(/[\s-]/g, ''))) {
      e.phone = 'Enter a valid Kenyan number (e.g. 0712 345 678)';
    }
    if (!resForm.email.trim()) e.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(resForm.email)) e.email = 'Enter a valid email address';
    return e;
  };

  const handleResSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validateRes();
    setResErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await axios.post(`${apiBase}/api/book-restaurant`, {
        fullName: resForm.name,
        date: resForm.date,
        time: resForm.time,
        guests: `${resForm.guests} ${Number(resForm.guests) === 1 ? 'Guest' : 'Guests'}`,
        seatingArea: resForm.seatingArea,
        occasion: resForm.occasion,
        phone: resForm.phone,
        email: resForm.email,
        requests: resForm.requests || 'None',
      });

      const resData = response.data;
      setConfirmedReservation({
        requestId: resData.requestId,
        name: resData.reservation?.fullName || resForm.name,
        email: resForm.email,
        phone: resForm.phone,
        date: resData.reservation?.date || resForm.date,
        time: resData.reservation?.time || resForm.time,
        guests: resData.reservation?.guests || `${resForm.guests} ${Number(resForm.guests) === 1 ? 'Guest' : 'Guests'}`,
        seatingArea: resData.reservation?.seatingArea || resForm.seatingArea,
        occasion: resData.reservation?.occasion || resForm.occasion,
        emailStatus: resData.emailStatus,
      });
    } catch (error) {
      console.error(error);
      const serverMessage = error.response?.data?.message;
      setSubmitError(
        serverMessage ||
          'Unable to submit your table reservation online at this moment. Please call concierge directly at ' +
            CONTACT_INFO.phone
      );
    } finally {
      setLoading(false);
    }
  };

  const menuTabs = Object.entries(MENU_CATEGORIES);
  const activeMenuCategory = MENU_CATEGORIES[activeMenuTab] || MENU_CATEGORIES.starters;
  const currentCategoryItems = activeMenuCategory.items || [];
  const lightboxDish = lightboxIndex !== null ? currentCategoryItems[lightboxIndex] : null;

  // Category Tab Switch
  const handleTabChange = (key) => {
    setActiveMenuTab(key);
    setLightboxIndex(null);
  };

  // GSAP animation on category tab change
  useEffect(() => {
    const isReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!isReduced && menuGridRef.current) {
      gsap.fromTo(
        menuGridRef.current.children,
        { opacity: 0, y: 14 },
        { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power2.out' }
      );
    }
  }, [activeMenuTab]);

  // Fullscreen Lightbox handlers
  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
  }, []);

  const nextLightboxDish = useCallback((e) => {
    e?.stopPropagation();
    if (!currentCategoryItems.length) return;
    setLightboxIndex((prev) => (prev + 1) % currentCategoryItems.length);
  }, [currentCategoryItems.length]);

  const prevLightboxDish = useCallback((e) => {
    e?.stopPropagation();
    if (!currentCategoryItems.length) return;
    setLightboxIndex((prev) => (prev - 1 + currentCategoryItems.length) % currentCategoryItems.length);
  }, [currentCategoryItems.length]);

  useEffect(() => {
    if (lightboxIndex === null) return;

    const handleLightboxKey = (e) => {
      if (e.key === 'Escape') {
        closeLightbox();
      } else if (e.key === 'ArrowRight') {
        nextLightboxDish();
      } else if (e.key === 'ArrowLeft') {
        prevLightboxDish();
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    window.addEventListener('keydown', handleLightboxKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener('keydown', handleLightboxKey);
    };
  }, [lightboxIndex, closeLightbox, nextLightboxDish, prevLightboxDish]);

  // Determine dynamic card stack transformations
  const getCardStyle = (index) => {
    const diff = (index - activeSlide + totalSlides) % totalSlides;
    if (diff === 0) {
      return {
        transform: 'translate3d(0, 0, 0) scale(1) rotate(0deg)',
        opacity: 1,
        zIndex: 4,
        pointerEvents: 'auto',
      };
    } else if (diff === 1) {
      return {
        transform: 'translate3d(24px, 12px, -30px) scale(0.93) rotate(2deg)',
        opacity: 0.68,
        zIndex: 3,
        pointerEvents: 'auto',
        cursor: 'pointer',
      };
    } else if (diff === 2) {
      return {
        transform: 'translate3d(8px, 20px, -60px) scale(0.86) rotate(1deg)',
        opacity: 0.32,
        zIndex: 2,
        pointerEvents: 'none',
      };
    }
    return {
      transform: 'translate3d(0, 26px, -90px) scale(0.8)',
      opacity: 0,
      zIndex: 1,
      pointerEvents: 'none',
    };
  };

  return (
    <section id="restaurant" className="restaurant aura-surface-warm section-pad">
      <div className="container">
        {/* Editorial Section Masthead */}
        <div className="editorial-header-split">
          <div>
            <h2 className="section-title">
              Restaurant &amp;{' '}
              <em>
                <span className="highlight-marker"><GradientText>Culinary Grounds</GradientText></span>
              </em>
            </h2>
          </div>
          <p className="editorial-lead">
            From sunlit lunches inside our courtyard gazebos to evening fireside cuts and lakeside aperitifs, experience farm-fresh ingredients crafted with unhurried care beneath the Ruiru pines.
          </p>
        </div>

        {/* =========================================================================
            INTERACTIVE SLIDING FOOD SHOWCASE (EDITORIAL CAROUSEL)
           ========================================================================= */}
        <div
          className="dish-showcase"
          tabIndex={0}
          onKeyDown={handleKeyDown}
          aria-label="Featured culinary showcase carousel"
        >
          <div className="dish-showcase__grid">
            {/* Left Column: Layered Card Stage with 3D Slide Movement */}
            <div
              className="dish-showcase__stage-wrap"
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
            >
              <div className="dish-showcase__stage">
                <div className="dish-showcase__stack">
                  {FEATURED_DISHES.map((dish, idx) => {
                    const cardStyle = getCardStyle(idx);
                    const isCurrent = idx === activeSlide;
                    const isNext = (idx - activeSlide + totalSlides) % totalSlides === 1;

                    return (
                      <div
                        key={dish.id}
                        className={`dish-card ${isCurrent ? 'dish-card--active' : ''} ${
                          isNext ? 'dish-card--next' : ''
                        }`}
                        style={cardStyle}
                        onClick={isNext ? nextSlide : undefined}
                        role="group"
                        aria-roledescription="slide"
                        aria-label={dish.name}
                      >
                        <div className="dish-card__media">
                          <img
                            src={dish.image}
                            alt={dish.alt}
                            className="dish-card__img"
                            loading={idx === 0 ? 'eager' : 'lazy'}
                          />
                          <div className="dish-card__overlay" />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Right Column: Editorial Dish Information */}
            <div className="dish-showcase__info-wrap">
              <div className="dish-showcase__content" ref={dishContentRef}>
                <span className="dish-showcase__price">{formatKSh(currentDish.price)}</span>

                <h3 className="dish-showcase__title">{currentDish.name}</h3>

                <p className="dish-showcase__desc">{currentDish.desc}</p>

                {/* Refined Detail Rows (Clean & Typographic) */}
                <div className="dish-showcase__details">
                  {currentDish.details.map((detail, dIdx) => (
                    <div key={dIdx} className="dish-showcase__detail-row">
                      <span className="dish-showcase__detail-label">{detail.label}</span>
                      <span className="dish-showcase__detail-val">{detail.value}</span>
                    </div>
                  ))}
                </div>

                {/* Minimal Numerical Indicator & Navigation Controls */}
                <div className="dish-showcase__controls">
                  <div className="dish-showcase__pagination">
                    <span className="current-idx">0{activeSlide + 1}</span>
                    <span className="divider">/</span>
                    <span className="total-idx">0{totalSlides}</span>
                    <div className="dish-showcase__progress-bar">
                      <div
                        className="dish-showcase__progress-fill"
                        style={{ width: `${((activeSlide + 1) / totalSlides) * 100}%` }}
                      />
                    </div>
                  </div>

                  <div className="dish-showcase__buttons">
                    <button
                      type="button"
                      className="dish-nav-btn dish-nav-btn--prev"
                      onClick={prevSlide}
                      aria-label="Previous featured dish"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      className="dish-nav-btn dish-nav-btn--next"
                      onClick={nextSlide}
                      aria-label="Next featured dish"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Explore Full Menu Understated Trigger */}
                <div className="dish-showcase__menu-action">
                  <button
                    type="button"
                    className="btn btn-menu-toggle"
                    onClick={handleToggleMenu}
                    aria-expanded={isMenuExpanded}
                  >
                    <span>{isMenuExpanded ? 'Hide Complete Dining Menu' : 'Explore Complete Dining Menu'}</span>
                    {isMenuExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>
                  <span className="menu-action-note">Authentic Kenyan Cuisine · Starters, Mains, Desserts &amp; Refreshments</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* =========================================================================
            COMPLETE DINING MENU (PHOTOGRAPHY-LED EDITORIAL EXPERIENCE)
           ========================================================================= */}
        {isMenuExpanded && (
          <div className="restaurant__full-menu" ref={fullMenuSectionRef} id="complete-dining-menu">
            <div className="full-menu__masthead">
              <h3 className="full-menu__title">Complete Dining Menu</h3>
              <p className="full-menu__sub">{activeMenuCategory.note}</p>

              {/* Category Navigation Tabs */}
              <div className="full-menu__tabs" role="tablist" aria-label="Menu categories">
                {menuTabs.map(([key, cat]) => {
                  const TabIcon = CATEGORY_ICON_MAP[key] || Utensils;
                  const isCurrent = activeMenuTab === key;
                  return (
                    <button
                      type="button"
                      role="tab"
                      key={key}
                      aria-selected={isCurrent}
                      className={`full-menu__tab ${isCurrent ? 'full-menu__tab--active' : ''}`}
                      onClick={() => handleTabChange(key)}
                    >
                      <TabIcon size={14} />
                      <span>{cat.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Photography-Led Two-Column Grid */}
            <div className="menu-photo-grid" ref={menuGridRef} role="tabpanel">
              {currentCategoryItems.map((item, idx) => (
                <div key={item.id || item.name} className="menu-photo-card">
                  <div
                    className="menu-photo-card__media"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLightboxIndex(idx);
                    }}
                    role="button"
                    tabIndex={0}
                    aria-label={`Enlarge photograph of ${item.name}`}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        e.stopPropagation();
                        setLightboxIndex(idx);
                      }
                    }}
                  >
                    <img
                      src={item.image}
                      alt={item.alt || item.name}
                      className="menu-photo-card__img"
                      loading="lazy"
                    />
                    <div className="menu-photo-card__overlay">
                      <span className="menu-photo-card__zoom-hint">
                        <Maximize2 size={15} />
                        <span>View Dish</span>
                      </span>
                    </div>
                  </div>

                  <div className="menu-photo-card__info">
                    <div className="menu-photo-card__header">
                      <h4 className="menu-photo-card__title">{item.name}</h4>
                      <span className="menu-photo-card__price">{item.price ? formatKSh(item.price) : 'Price on request'}</span>
                    </div>
                    <p className="menu-photo-card__desc">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* =========================================================================
            FULLSCREEN DISH LIGHTBOX / IMAGE-DETAIL OVERLAY
           ========================================================================= */}
        {lightboxDish && (
          <div
            className="dish-lightbox"
            role="dialog"
            aria-modal="true"
            aria-label={`Enlarged view of ${lightboxDish.name}`}
            onClick={closeLightbox}
          >
            <div className="dish-lightbox__backdrop" />

            <div
              className="dish-lightbox__dialog"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Close Button */}
              <button
                type="button"
                className="dish-lightbox__close"
                onClick={closeLightbox}
                aria-label="Close enlarged dish preview"
              >
                <X size={20} />
              </button>

              {/* Navigation Controls */}
              {currentCategoryItems.length > 1 && (
                <>
                  <button
                    type="button"
                    className="dish-lightbox__nav dish-lightbox__nav--prev"
                    onClick={prevLightboxDish}
                    aria-label="Previous dish in category"
                  >
                    <ChevronLeft size={22} />
                  </button>
                  <button
                    type="button"
                    className="dish-lightbox__nav dish-lightbox__nav--next"
                    onClick={nextLightboxDish}
                    aria-label="Next dish in category"
                  >
                    <ChevronRight size={22} />
                  </button>
                </>
              )}

              {/* Lightbox Media */}
              <div className="dish-lightbox__media">
                <img
                  src={lightboxDish.image}
                  alt={lightboxDish.alt || lightboxDish.name}
                  className="dish-lightbox__img"
                />
              </div>

              {/* Lightbox Content */}
              <div className="dish-lightbox__body">
                <div className="dish-lightbox__header">
                  <h3 className="dish-lightbox__title">{lightboxDish.name}</h3>
                  <span className="dish-lightbox__price">{lightboxDish.price ? formatKSh(lightboxDish.price) : 'Price on request'}</span>
                </div>
                <p className="dish-lightbox__desc">{lightboxDish.desc}</p>
              </div>
            </div>
          </div>
        )}

        {/* =========================================================================
            DINING VENUES SHOWCASE (THE GARDEN ROOM & THE TERRACE BAR)
           ========================================================================= */}
        <div className="restaurant__venues">
          <div className="restaurant__venues-masthead">
            <h3 className="restaurant__venues-heading">
              Our Dining <em>Venues</em>
            </h3>
            <p className="restaurant__venues-sub">
              Two unique atmospheres curated for relaxed daytime lunches, intimate romantic dinners, and celebratory family feasts.
            </p>
          </div>

          {/* Venue 1: The Garden Room & Courtyard Gazebos */}
          <AnimatedContent className="restaurant__venue-row">
            <div className="restaurant__venue-media">
              <ScrollExpandImage
                src={gardenDiningImg}
                alt="The Garden Room and Courtyard Gazebos at AdvaBliss Resort"
                className="restaurant__venue-photo"
              />
            </div>

            <div className="restaurant__venue-body">
              <h4 className="restaurant__venue-title">The Garden Room &amp; Courtyard Gazebos</h4>
              <p className="restaurant__venue-desc">
                Surrounded by verdant lawns and tranquil pine shade, our signature dining room features floor-to-ceiling glass and private wooden gazebos. Savor chef-curated seasonal tasting menus with dedicated fireside service.
              </p>

              <div className="restaurant__venue-meta-grid">
                <div className="restaurant__venue-meta-item">
                  <Clock size={15} />
                  <div>
                    <span className="meta-lbl">Lunch Service</span>
                    <strong>12:00 – 15:00 Daily</strong>
                  </div>
                </div>
                <div className="restaurant__venue-meta-item">
                  <Clock size={15} />
                  <div>
                    <span className="meta-lbl">Dinner Service</span>
                    <strong>18:00 – 23:00 Daily</strong>
                  </div>
                </div>
                <div className="restaurant__venue-meta-item">
                  <Users size={15} />
                  <div>
                    <span className="meta-lbl">Seating Capacity</span>
                    <strong>Up to 80 Guests</strong>
                  </div>
                </div>
                <div className="restaurant__venue-meta-item">
                  <ShieldCheck size={15} />
                  <div>
                    <span className="meta-lbl">Ambiance</span>
                    <strong>Botanical &amp; Sheltered</strong>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>

          {/* Venue 2: The Terrace & Garden Bar */}
          <AnimatedContent className="restaurant__venue-row restaurant__venue-row--reverse">
            <div className="restaurant__venue-media">
              <ScrollExpandImage
                src={lakesideSeatingImg}
                alt="The Terrace and Lakeside Garden Bar open-air dining at AdvaBliss Resort"
                className="restaurant__venue-photo"
              />
            </div>

            <div className="restaurant__venue-body">
              <h4 className="restaurant__venue-title">The Terrace &amp; Garden Bar</h4>
              <p className="restaurant__venue-desc">
                Open-air terrace dining under our signature marquee pavilion and shaded lakeside canopies. Enjoy balmy evening breezes, chilled botanical spritzes, artisanal coffees, and wood-grilled plates through golden hour and beyond.
              </p>

              <div className="restaurant__venue-meta-grid">
                <div className="restaurant__venue-meta-item">
                  <Sun size={15} />
                  <div>
                    <span className="meta-lbl">All-Day Service</span>
                    <strong>10:00 – 24:00 Daily</strong>
                  </div>
                </div>
                <div className="restaurant__venue-meta-item">
                  <Wine size={15} />
                  <div>
                    <span className="meta-lbl">Golden Hour Pours</span>
                    <strong>17:00 – 19:00 Daily</strong>
                  </div>
                </div>
                <div className="restaurant__venue-meta-item">
                  <Users size={15} />
                  <div>
                    <span className="meta-lbl">Seating Capacity</span>
                    <strong>Up to 150 Guests</strong>
                  </div>
                </div>
                <div className="restaurant__venue-meta-item">
                  <Coffee size={15} />
                  <div>
                    <span className="meta-lbl">Experience</span>
                    <strong>Lakeside Breezes &amp; Music</strong>
                  </div>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>

        {/* =========================================================================
            TABLE RESERVATION CONCIERGE DESK
           ========================================================================= */}
        <div className="restaurant__res-desk" id="restaurant-booking">
          {/* Left Column: Authentic Dining Table Setting & Guarantees */}
          <div className="restaurant__res-visual aura-surface-dark">
            <div className="restaurant__res-photo-wrap">
              <ScrollExpandImage
                src={tableImg}
                alt="Reserved fine dining table setting with champagne glasses at AdvaBliss Resort"
                className="restaurant__res-photo"
              />
            </div>

            <div className="restaurant__res-promises">
              <h4 className="restaurant__res-promises-title">The Table Experience</h4>
              <p className="restaurant__res-promises-desc">
                Whether celebrating a milestone or gathering over an intimate family lunch, your table will be carefully prepared before your arrival.
              </p>
              <ul className="restaurant__res-promises-list">
                <li>
                  <Sparkles size={14} />
                  <span>Complimentary table styling for birthdays &amp; anniversaries</span>
                </li>
                <li>
                  <MapPin size={14} />
                  <span>Your choice of The Garden Room, Terrace Bar, or Gazebos</span>
                </li>
                <li>
                  <ShieldCheck size={14} />
                  <span>Dedicated table attendant &amp; direct concierge confirmation</span>
                </li>
              </ul>
            </div>

            <div className="restaurant__res-statement">
              <blockquote className="restaurant__res-quote">
                Every gathering deserves a{' '}
                <em className="restaurant__res-quote-accent">setting worth remembering</em>.
              </blockquote>
              <p className="restaurant__res-statement-sub">
                From intimate family lunches to special celebrations, we bring thoughtful details, warm hospitality and beautifully prepared surroundings together to make every visit memorable.
              </p>
            </div>
          </div>

          {/* Right Column: Functional Reservation Form */}
          <div className="restaurant__res-form-wrap">
            <div className="restaurant__res-form-header">
              <h3 className="restaurant__res-title">Reserve Your Table</h3>
              <p className="restaurant__res-sub">
                Secure your preferred seating in The Garden Room, open-air terrace, or a secluded courtyard gazebo.
              </p>
            </div>

            {loading && (
              <div className="ui-progress-bar" role="progressbar" aria-label="Submitting reservation">
                <div className="ui-progress-bar__fill" />
              </div>
            )}

            {submitError && (
              <div className="form-banner form-banner--error" role="alert">
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            {confirmedReservation ? (
              <div className="restaurant__voucher">
                <div className="voucher__icon">
                  <CheckCircle2 size={32} />
                </div>
                <h4 className="voucher__title">Table Reservation Received</h4>
                {confirmedReservation.requestId && (
                  <p style={{ fontSize: '12px', letterSpacing: '1px', textTransform: 'uppercase', color: 'var(--gold)', margin: '4px 0 12px', fontWeight: 600 }}>
                    Reference: {confirmedReservation.requestId}
                  </p>
                )}
                <p className="voucher__lead">
                  Thank you, <strong>{confirmedReservation.name}</strong>. Your table request for{' '}
                  <strong>{confirmedReservation.guests}</strong> at{' '}
                  <strong>{confirmedReservation.seatingArea}</strong> on{' '}
                  <strong>{confirmedReservation.date}</strong> at{' '}
                  <strong>{confirmedReservation.time}</strong> has been received.
                </p>
                <div className="voucher__ledger">
                  <div>
                    <span>Confirmation Email</span>
                    <strong>{confirmedReservation.email}</strong>
                  </div>
                  <div>
                    <span>Contact Phone</span>
                    <strong>{confirmedReservation.phone}</strong>
                  </div>
                  <div>
                    <span>Occasion</span>
                    <strong>{confirmedReservation.occasion}</strong>
                  </div>
                </div>
                <p className="voucher__note">
                  {confirmedReservation.emailStatus?.guest
                    ? 'An acknowledgement has been dispatched to your email. Our restaurant concierge will contact you within 2 hours to confirm your seating.'
                    : 'Our restaurant concierge will contact you within 2 hours via phone or WhatsApp to confirm your seating and accommodate any special dietary preferences.'}
                </p>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => {
                    setConfirmedReservation(null);
                    setResForm({
                      name: '',
                      seatingArea: 'The Garden Room & Gazebos',
                      date: '',
                      time: '19:00',
                      guests: '2',
                      phone: '',
                      email: '',
                      occasion: 'None',
                      requests: '',
                    });
                  }}
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form className="restaurant__form" onSubmit={handleResSubmit} noValidate>
                <div className="restaurant__form-grid">
                  <div className="form-group span-2">
                    <label htmlFor="res-name" className="form-label">
                      Guest Full Name *
                    </label>
                    <input
                      id="res-name"
                      className={`form-input ${resErrors.name ? 'error' : ''}`}
                      placeholder="e.g. David &amp; Sarah Kamau"
                      value={resForm.name}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                    {resErrors.name && <span className="form-error">{resErrors.name}</span>}
                  </div>

                  <div className="form-group span-2">
                    <label htmlFor="res-seating" className="form-label">
                      Seating Preference *
                    </label>
                    <select
                      id="res-seating"
                      className="form-select"
                      value={resForm.seatingArea}
                      onChange={(e) => setField('seatingArea', e.target.value)}
                    >
                      <option value="The Garden Room & Gazebos">The Garden Room &amp; Gazebos (Indoor Glasshouse &amp; Pergolas)</option>
                      <option value="The Terrace & Garden Bar">The Terrace &amp; Garden Bar (Al Fresco Lakeside &amp; Marquee)</option>
                      <option value="Lakeside Waterfront Seating">Lakeside Waterfront Seating (By the Lake Canopy)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-date" className="form-label">
                      Dining Date *
                    </label>
                    <input
                      type="date"
                      id="res-date"
                      className={`form-input ${resErrors.date ? 'error' : ''}`}
                      value={resForm.date}
                      onChange={(e) => setField('date', e.target.value)}
                    />
                    {resErrors.date && <span className="form-error">{resErrors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-time" className="form-label">
                      Preferred Time *
                    </label>
                    <select
                      id="res-time"
                      className={`form-select ${resErrors.time ? 'error' : ''}`}
                      value={resForm.time}
                      onChange={(e) => setField('time', e.target.value)}
                    >
                      <option value="12:00">12:00 (Lunch Opening)</option>
                      <option value="12:30">12:30 (Lunch)</option>
                      <option value="13:00">13:00 (Lunch)</option>
                      <option value="13:30">13:30 (Lunch)</option>
                      <option value="14:00">14:00 (Late Lunch)</option>
                      <option value="17:00">17:00 (Sundowners)</option>
                      <option value="18:00">18:00 (Early Dinner)</option>
                      <option value="19:00">19:00 (Dinner)</option>
                      <option value="19:30">19:30 (Dinner)</option>
                      <option value="20:00">20:00 (Dinner)</option>
                      <option value="20:30">20:30 (Late Dinner)</option>
                    </select>
                    {resErrors.time && <span className="form-error">{resErrors.time}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-guests" className="form-label">
                      Number of Guests *
                    </label>
                    <select
                      id="res-guests"
                      className="form-select"
                      value={resForm.guests}
                      onChange={(e) => setField('guests', e.target.value)}
                    >
                      <option value="1">1 Guest</option>
                      <option value="2">2 Guests (Table for Two)</option>
                      <option value="3">3 Guests</option>
                      <option value="4">4 Guests</option>
                      <option value="5">5 Guests</option>
                      <option value="6">6 Guests</option>
                      <option value="8">8 Guests (Large Table)</option>
                      <option value="10+">10+ Guests (Group Booking)</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-occasion" className="form-label">
                      Occasion
                    </label>
                    <select
                      id="res-occasion"
                      className="form-select"
                      value={resForm.occasion}
                      onChange={(e) => setField('occasion', e.target.value)}
                    >
                      <option value="None">Casual Dining / No Occasion</option>
                      <option value="Birthday">Birthday Celebration</option>
                      <option value="Wedding Anniversary">Wedding Anniversary</option>
                      <option value="Date Night">Romantic Date Night</option>
                      <option value="Business Lunch">Business / Corporate Meeting</option>
                      <option value="Family Gathering">Family Gathering</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-phone" className="form-label">
                      Contact Phone *
                    </label>
                    <input
                      type="tel"
                      id="res-phone"
                      className={`form-input ${resErrors.phone ? 'error' : ''}`}
                      placeholder="e.g. 0722 000 000"
                      value={resForm.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                    {resErrors.phone && <span className="form-error">{resErrors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="res-email" className="form-label">
                      Confirmation Email *
                    </label>
                    <input
                      type="email"
                      id="res-email"
                      className={`form-input ${resErrors.email ? 'error' : ''}`}
                      placeholder="name@example.com"
                      value={resForm.email}
                      onChange={(e) => setField('email', e.target.value)}
                    />
                    {resErrors.email && <span className="form-error">{resErrors.email}</span>}
                  </div>

                  <div className="form-group span-2">
                    <label htmlFor="res-requests" className="form-label">
                      Special Requests / Dietary Notes
                    </label>
                    <textarea
                      id="res-requests"
                      className="form-input form-textarea"
                      placeholder="e.g. Gazebo preference, high chair for infant, vegetarian options, birthday cake..."
                      rows={3}
                      value={resForm.requests}
                      onChange={(e) => setField('requests', e.target.value)}
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn btn-gold restaurant__submit-btn"
                  disabled={loading}
                >
                  <Calendar size={16} />
                  <span>{loading ? 'Confirming Table...' : 'Reserve Table Now'}</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
