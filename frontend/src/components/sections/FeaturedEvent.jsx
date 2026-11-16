import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, ArrowUpRight } from 'lucide-react';
import { FEATURED_EVENT } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent } from '../ui/ReactBits';
import './FeaturedEvent.css';

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({
    expired: false,
    months: 0,
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    const calc = () => {
      const now = new Date().getTime();
      const target = new Date(targetDate).getTime();
      const diff = target - now;

      if (diff <= 0) {
        setTimeLeft({
          expired: true,
          months: 0,
          days: 0,
          hours: 0,
          minutes: 0,
          seconds: 0,
        });
        return;
      }

      const totalSeconds = Math.floor(diff / 1000);
      const months = Math.floor(totalSeconds / (30 * 24 * 3600));
      const days = Math.floor((totalSeconds % (30 * 24 * 3600)) / (24 * 3600));
      const hours = Math.floor((totalSeconds % (24 * 3600)) / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      setTimeLeft({ expired: false, months, days, hours, minutes, seconds });
    };

    calc();
    const interval = setInterval(calc, 1000);
    return () => clearInterval(interval);
  }, [targetDate]);

  return timeLeft;
}

function CountdownUnit({ value, label }) {
  return (
    <div className="countdown__unit">
      <span className="countdown__value">{String(value ?? 0).padStart(2, '0')}</span>
      <span className="countdown__label">{label}</span>
    </div>
  );
}

export default function FeaturedEvent() {
  const ev = FEATURED_EVENT;
  const timeLeft = useCountdown(ev.date);

  const formatDate = (d) =>
    new Date(d).toLocaleDateString('en-GB', {
      weekday: 'long',
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    });
  const formatTime = (d) =>
    new Date(d).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <section id="featured-event" className="featured-event aura-surface-dark aura-grain section-pad">
      <div className="container featured-event__inner">
        <div className="featured-event__layout">
          {/* Editorial Event Details & Countdown */}
          <AnimatedContent className="featured-event__editorial">
            <span className="section-eyebrow light">{ev.subtitle}</span>

            <h2 className="featured-event__title">
              <SplitText text="The Afternoon Bliss Party" delay={45} />
              <span className="featured-event__season">
                <GradientText> — Season 8</GradientText>
              </span>
            </h2>

            <p className="featured-event__programme">
              Live Afro-Pop, Gengetone, Gospel &amp; Benga · Garden Light Show
            </p>

            <p className="featured-event__desc">{ev.description}</p>

            {/* Sophisticated Horizontal Serif Countdown */}
            <div className="featured-event__countdown" aria-label="Event countdown">
              <div className="countdown__grid">
                <CountdownUnit value={timeLeft.months} label="Months" />
                <span className="countdown__sep" aria-hidden="true" />
                <CountdownUnit value={timeLeft.days} label="Days" />
                <span className="countdown__sep" aria-hidden="true" />
                <CountdownUnit value={timeLeft.hours} label="Hours" />
                <span className="countdown__sep" aria-hidden="true" />
                <CountdownUnit value={timeLeft.minutes} label="Mins" />
                <span className="countdown__sep" aria-hidden="true" />
                <CountdownUnit value={timeLeft.seconds} label="Secs" />
              </div>
            </div>

            <div className="featured-event__meta">
              <div className="featured-event__meta-item">
                <Calendar size={15} strokeWidth={1.6} />
                <div>
                  <span className="featured-event__meta-lbl">Date</span>
                  <span className="featured-event__meta-val">{formatDate(ev.date)}</span>
                </div>
              </div>

              <div className="featured-event__meta-item">
                <Clock size={15} strokeWidth={1.6} />
                <div>
                  <span className="featured-event__meta-lbl">Gates Open</span>
                  <span className="featured-event__meta-val">{formatTime(ev.date)} EAT</span>
                </div>
              </div>

              <div className="featured-event__meta-item">
                <MapPin size={15} strokeWidth={1.6} />
                <div>
                  <span className="featured-event__meta-lbl">Venue</span>
                  <span className="featured-event__meta-val">{ev.location}</span>
                </div>
              </div>
            </div>

            <div className="featured-event__actions">
              <a
                href={ev.ticketUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-gold featured-event__ticket-btn"
              >
                <Ticket size={16} />
                <span>HustleSasa Box Office</span>
                <ArrowUpRight size={15} className="featured-event__ticket-arrow" />
              </a>
            </div>
          </AnimatedContent>

          {/* Sculpted Organic Event Photograph */}
          <AnimatedContent delay={140} className="featured-event__visual">
            <div className="featured-event__organic-stage">
              <div className="featured-event__organic-halo" aria-hidden="true" />
              <div className="featured-event__organic-ring" aria-hidden="true" />
              <div className="featured-event__organic-mask">
                <img
                  src={ev.image}
                  alt={ev.title}
                  className="featured-event__organic-img"
                />
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
