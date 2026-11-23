import React, { useState, useEffect, useCallback, useRef } from 'react';
import {
  Menu,
  X,
  Phone,
  Calendar,
  ChevronDown,
} from 'lucide-react';
import { NAV_LINKS, ACTIVITIES_LINKS, CONTACT_INFO } from '../../data/siteData';
import './Navbar.css';
import logo from '../images/logo.webp';

export default function Navbar({ onBookNow }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileActivitiesOpen, setMobileActivitiesOpen] = useState(false);
  const dropdownTimeoutRef = useRef(null);
  const dropdownTriggerRef = useRef(null);
  const menuItemsRef = useRef([]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 48);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Handle Escape key to close dropdown and drawer
  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') {
        setDropdownOpen(false);
        if (menuOpen) setMenuOpen(false);
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [menuOpen]);

  // Scroll-spy for active navigation tracking across all sections
  useEffect(() => {
    if (typeof IntersectionObserver === 'undefined') return;
    const sectionIds = ['home', 'accommodation', 'restaurant', 'events', 'activities', 'offers', 'virtual-tour', 'contact'];
    const elements = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id);
          }
        });
      },
      { rootMargin: '-30% 0px -55% 0px', threshold: 0.02 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  // Lock body scroll when mobile drawer is open
  useEffect(() => {
    if (menuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [menuOpen]);

  const scrollTo = useCallback((id) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 82;
      const top = el.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    setMenuOpen(false);
    setDropdownOpen(false);
    setActiveSection(id.startsWith('activit') ? 'activities' : id);
  }, []);

  const handleDropdownEnter = () => {
    if (dropdownTimeoutRef.current) clearTimeout(dropdownTimeoutRef.current);
    setDropdownOpen(true);
  };

  const handleDropdownLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setDropdownOpen(false);
    }, 180);
  };

  const isActivitiesActive =
    activeSection === 'activities' ||
    activeSection.startsWith('activity-');

  return (
    <>
      <header className={`navbar ${scrolled ? 'navbar--scrolled' : ''}`}>
        <div className="container navbar__inner">
          {/* Brand Crest & Editorial Lockup */}
          <button
            className="navbar__brand"
            onClick={() => scrollTo('home')}
            aria-label="AdvaBliss Resort Ruiru — Return to top"
          >
            <span className="navbar__crest-wrap">
              <img
                src={logo}
                alt="AdvaBliss Resort Crest"
                className="navbar__crest"
                width="44"
                height="44"
              />
            </span>
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">AdvaBliss</span>
              <span className="navbar__brand-sub">Resort in Ruiru</span>
            </span>
          </button>

          {/* Desktop Editorial Navigation */}
          <nav aria-label="Primary navigation" className="navbar__nav">
            <ul className="navbar__links">
              {NAV_LINKS.map((link) => {
                if (link.id === 'activities') {
                  return (
                    <li
                      key={link.id}
                      className="navbar__item--dropdown"
                      onMouseEnter={handleDropdownEnter}
                      onMouseLeave={handleDropdownLeave}
                      onBlur={(e) => {
                        if (!e.currentTarget.contains(e.relatedTarget)) {
                          setDropdownOpen(false);
                        }
                      }}
                    >
                      <div className="navbar__dropdown-trigger-group">
                        <button
                          type="button"
                          className={`navbar__link ${isActivitiesActive ? 'navbar__link--active' : ''}`}
                          onClick={() => scrollTo('activities')}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setDropdownOpen(true);
                              setTimeout(() => menuItemsRef.current[0]?.focus(), 50);
                            }
                          }}
                        >
                          {link.label}
                        </button>
                        <button
                          ref={dropdownTriggerRef}
                          type="button"
                          className={`navbar__dropdown-arrow-btn ${dropdownOpen ? 'navbar__dropdown-arrow-btn--open' : ''}`}
                          onClick={() => setDropdownOpen((v) => !v)}
                          onKeyDown={(e) => {
                            if (e.key === 'ArrowDown') {
                              e.preventDefault();
                              setDropdownOpen(true);
                              setTimeout(() => menuItemsRef.current[0]?.focus(), 50);
                            }
                          }}
                          aria-expanded={dropdownOpen}
                          aria-haspopup="true"
                          aria-label="Toggle Games & Activities menu"
                        >
                          <ChevronDown size={14} />
                        </button>
                      </div>

                      {/* Compact Single-Column Rectangular Activities Dropdown */}
                      <ul
                        className={`navbar__dropdown-menu ${
                          dropdownOpen ? 'navbar__dropdown-menu--open' : ''
                        }`}
                        role="menu"
                        aria-label="Games & Activities"
                      >
                        {ACTIVITIES_LINKS.map((item, index) => (
                          <li key={item.id} role="none" className="navbar__dropdown-item-wrap">
                            <button
                              ref={(el) => {
                                menuItemsRef.current[index] = el;
                              }}
                              type="button"
                              role="menuitem"
                              className="navbar__dropdown-link"
                              onClick={() => {
                                setDropdownOpen(false);
                                scrollTo(item.target);
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'ArrowDown') {
                                  e.preventDefault();
                                  const nextIdx = (index + 1) % ACTIVITIES_LINKS.length;
                                  menuItemsRef.current[nextIdx]?.focus();
                                } else if (e.key === 'ArrowUp') {
                                  e.preventDefault();
                                  if (index === 0) {
                                    dropdownTriggerRef.current?.focus();
                                  } else {
                                    menuItemsRef.current[index - 1]?.focus();
                                  }
                                } else if (e.key === 'Escape') {
                                  e.preventDefault();
                                  setDropdownOpen(false);
                                  dropdownTriggerRef.current?.focus();
                                }
                              }}
                            >
                              {item.name}
                            </button>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={link.id}>
                    <button
                      type="button"
                      className={`navbar__link ${activeSection === link.id ? 'navbar__link--active' : ''}`}
                      onClick={() => scrollTo(link.id)}
                    >
                      {link.label}
                    </button>
                  </li>
                );
              })}
            </ul>
          </nav>

          {/* Actions */}
          <div className="navbar__actions">
            <a
              href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
              className="navbar__tel"
              aria-label={`Call ${CONTACT_INFO.phoneDisplay}`}
            >
              <Phone size={14} strokeWidth={1.75} />
              <span>{CONTACT_INFO.phoneDisplay}</span>
            </a>

            <button
              type="button"
              className="btn btn-gold navbar__book"
              onClick={onBookNow}
            >
              <Calendar size={14} strokeWidth={1.8} />
              <span>Book Now</span>
            </button>

            <button
              type="button"
              className="navbar__hamburger"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? 'Close navigation menu' : 'Open navigation menu'}
              aria-expanded={menuOpen}
            >
              {menuOpen ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation Drawer */}
      <aside
        className={`mobile-menu ${menuOpen ? 'mobile-menu--open' : ''}`}
        aria-hidden={!menuOpen}
        aria-label="Mobile navigation"
      >
        <div className="mobile-menu__header">
          <div className="navbar__brand">
            <span className="navbar__crest-wrap">
              <img src={logo} alt="AdvaBliss Resort" className="navbar__crest" />
            </span>
            <span className="navbar__brand-text">
              <span className="navbar__brand-name">AdvaBliss</span>
              <span className="navbar__brand-sub">Resort in Ruiru</span>
            </span>
          </div>
          <button
            type="button"
            className="mobile-menu__close"
            onClick={() => setMenuOpen(false)}
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <ul className="mobile-menu__links">
          {NAV_LINKS.map((link) => {
            if (link.id === 'activities') {
              return (
                <li key={link.id} className="mobile-menu__item--accordion">
                  <div className="mobile-menu__accordion-header">
                    <button
                      type="button"
                      className={`mobile-menu__link ${isActivitiesActive ? 'mobile-menu__link--active' : ''}`}
                      onClick={() => scrollTo(link.id)}
                    >
                      <span className="mobile-menu__label">{link.label}</span>
                    </button>
                    <button
                      type="button"
                      className={`mobile-menu__accordion-toggle ${
                        mobileActivitiesOpen ? 'mobile-menu__accordion-toggle--open' : ''
                      }`}
                      onClick={() => setMobileActivitiesOpen(!mobileActivitiesOpen)}
                      aria-expanded={mobileActivitiesOpen}
                      aria-label="Expand Games and Activities submenu"
                    >
                      <ChevronDown size={18} />
                    </button>
                  </div>

                  {mobileActivitiesOpen && (
                    <div className="mobile-menu__submenu">
                      {ACTIVITIES_LINKS.map((item) => (
                        <button
                          key={item.id}
                          type="button"
                          className="mobile-menu__subitem"
                          onClick={() => {
                            setMobileActivitiesOpen(false);
                            scrollTo(item.target);
                          }}
                        >
                          {item.name}
                        </button>
                      ))}
                    </div>
                  )}
                </li>
              );
            }

            return (
              <li key={link.id}>
                <button
                  type="button"
                  className={`mobile-menu__link ${activeSection === link.id ? 'mobile-menu__link--active' : ''}`}
                  onClick={() => scrollTo(link.id)}
                >
                  <span className="mobile-menu__label">{link.label}</span>
                </button>
              </li>
            );
          })}
        </ul>

        <div className="mobile-menu__footer">
          <button
            type="button"
            className="btn btn-gold mobile-menu__book-btn"
            onClick={() => {
              setMenuOpen(false);
              onBookNow();
            }}
          >
            <Calendar size={15} />
            <span>Book Your Experience</span>
          </button>

          <div className="mobile-menu__contact">
            <a href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`} className="mobile-menu__contact-link">
              <Phone size={13} />
              <span>{CONTACT_INFO.phoneDisplay}</span>
            </a>
            <a
              href={CONTACT_INFO.socials.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              className="mobile-menu__contact-link"
            >
              <span>WhatsApp</span>
            </a>
          </div>
        </div>
      </aside>

      {menuOpen && (
        <div
          className="mobile-menu__backdrop"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}
    </>
  );
}
