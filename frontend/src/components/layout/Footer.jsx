import React from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Music2,
  Calendar,
} from 'lucide-react';
import { NAV_LINKS, CONTACT_INFO } from '../../data/siteData';
import './Footer.css';
import logo from '../images/logo.webp';

export default function Footer({ onBookNow }) {
  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) {
      window.scrollTo({
        top: el.getBoundingClientRect().top + window.scrollY - 82,
        behavior: 'smooth',
      });
    }
  };

  const year = new Date().getFullYear();

  return (
    <footer className="footer aura-surface-dark">
      <div className="footer__top">
        <div className="container footer__grid">
          {/* Brand Column */}
          <div className="footer__brand">
            <div className="footer__logo">
              <span className="navbar__crest-wrap">
                <img src={logo} alt="AdvaBliss Resort" className="navbar__crest" />
              </span>
              <div>
                <div className="footer__logo-main">AdvaBliss</div>
                <div className="footer__logo-sub">Resort in Ruiru</div>
              </div>
            </div>
            <p className="footer__tagline">
              An intimate garden and lakeside sanctuary in Ruiru — crafted for restful stays, seasonal dining, and landmark celebrations.
            </p>
            <div className="footer__socials">
              <a
                href={CONTACT_INFO.socials.instagram}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label="Instagram"
              >
                <Instagram size={17} />
              </a>
              <a
                href={CONTACT_INFO.socials.facebook}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label="Facebook"
              >
                <Facebook size={17} />
              </a>
              <a
                href={CONTACT_INFO.socials.twitter}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label="Twitter"
              >
                <Twitter size={17} />
              </a>
              <a
                href={CONTACT_INFO.socials.tiktok}
                target="_blank"
                rel="noopener noreferrer"
                className="footer__social"
                aria-label="TikTok"
              >
                <Music2 size={17} />
              </a>
            </div>
          </div>

          {/* Navigation Column */}
          <div className="footer__col">
            <h4 className="footer__col-title">Explore</h4>
            <ul className="footer__nav">
              {NAV_LINKS.map((link) => (
                <li key={link.id}>
                  <button
                    type="button"
                    className="footer__nav-link"
                    onClick={() => scrollTo(link.id)}
                  >
                    {link.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* Experiences Column */}
          <div className="footer__col">
            <h4 className="footer__col-title">Experiences</h4>
            <ul className="footer__nav">
              {[
                'Garden View & Deluxe Suites',
                'Family Paradise Residences',
                'The Garden Room & Terrace Bar',
                'Garden Weddings & Receptions',
                'Executive Corporate Retreats',
                'Canopy Rope Bridge & Ziplining',
                'Lakeside Boat Excursions',
                'Private Grounds Hire',
              ].map((s) => (
                <li key={s}>
                  <span className="footer__nav-link footer__nav-text">{s}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Concierge Desk Column */}
          <div className="footer__col">
            <h4 className="footer__col-title">Reservations Desk</h4>
            <div className="footer__contact">
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                className="footer__contact-item"
              >
                <Phone size={15} />
                <span>{CONTACT_INFO.phoneDisplay}</span>
              </a>
              <a href={`mailto:${CONTACT_INFO.email}`} className="footer__contact-item">
                <Mail size={15} />
                <span>{CONTACT_INFO.email}</span>
              </a>
              <div className="footer__contact-item">
                <MapPin size={15} />
                <span>{CONTACT_INFO.address}</span>
              </div>
            </div>
            <button type="button" className="btn btn-gold footer__cta" onClick={onBookNow}>
              <Calendar size={14} />
              <span>Reserve Now</span>
            </button>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <div className="container footer__bottom-inner">
          <p className="footer__copy">
            © {year} AdvaBliss Resort Ruiru. All rights reserved.
          </p>
          <div className="footer__legal">
            <span>Privacy Policy</span>
            <span>Terms of Stay</span>
            <a
  href="https://fredifytechnologies.co.ke"
  target="_blank"
  rel="noopener noreferrer"
  className="footer__credit"
  aria-label="Website designed by FredifyTechnologies"
>
  Designed By <strong>FredifyTechnologies</strong>
</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
