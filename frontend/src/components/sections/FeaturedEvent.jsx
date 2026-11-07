import React, { useState, useEffect } from 'react';
import { Calendar, MapPin, Clock, Ticket, Sparkles, ArrowUpRight } from 'lucide-react';
import { FEATURED_EVENT } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
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
          {/* Left Editorial Poster & Details */}
          <AnimatedContent className="featured-event__left">
            <h2 className="featured-event__title">
              <SplitText text="The Afternoon Bliss Party" delay={45} />
              <span className="featured-event__season">
                <GradientText> — Season 8</GradientText>
              </span>
            </h2>

            <p className="featured-event__desc">{ev.description}</p>

            <div className="featured-event__meta">
              <div className="featured-event__meta-item">
                <Calendar size={16} strokeWidth={1.75} />
                <div>
                  <span className="featured-event__meta-lbl">Date</span>
                  <span className="featured-event__meta-val">{formatDate(ev.date)}</span>
                </div>
              </div>

              <div className="featured-event__meta-item">
                <Clock size={16} strokeWidth={1.75} />
                <div>
                  <span className="featured-event__meta-lbl">Gates Open</span>
                  <span className="featured-event__meta-val">{formatTime(ev.date)} EAT</span>
                </div>
              </div>

              <div className="featured-event__meta-item">
                <MapPin size={16} strokeWidth={1.75} />
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
                <span>Acquire Tickets</span>
                <ArrowUpRight size={15} />
              </a>

              <a
                href="#accommodation"
                className="btn btn-outline-gold-light"
              >
                <span>Explore Event Stay Package</span>
              </a>
            </div>
          </AnimatedContent>

          {/* Right Photographic Frame & Live Countdown */}
          <AnimatedContent delay={150} className="featured-event__right">
            <div className="featured-event__visual-card">
              <ScrollExpandImage
                src={ev.image}
                alt={ev.title}
                className="featured-event__photo"
              />

              <div className="featured-event__countdown-panel">
                <div className="countdown__header">
                </div>

                <div className="countdown__grid">
                  <CountdownUnit value={timeLeft.months} label="Months" />
                  <span className="countdown__sep">:</span>
                  <CountdownUnit value={timeLeft.days} label="Days" />
                  <span className="countdown__sep">:</span>
                  <CountdownUnit value={timeLeft.hours} label="Hours" />
                  <span className="countdown__sep">:</span>
                  <CountdownUnit value={timeLeft.minutes} label="Mins" />
                  <span className="countdown__sep">:</span>
                  <CountdownUnit value={timeLeft.seconds} label="Secs" />
                </div>

                <div className="countdown__footer">
                  <span>Live Afro-Pop, Gengetone, Gospel &amp; Benga · Garden Light Show</span>
                  <a
                    href={ev.ticketUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="editorial-link light"
                  >
                    <span>HustleSasa Box Office</span>
                    <ArrowUpRight size={14} />
                  </a>
                </div>
              </div>
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
