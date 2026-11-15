import React, { useMemo, useState } from 'react';
import {
  Check,
  Send,
  Heart,
  Briefcase,
  Sparkles,
  Trees,
  Tent,
  Flower2,
  Volume2,
  Music,
  Lightbulb,
  UtensilsCrossed,
  Users,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { EVENT_TYPES, EVENT_ADDONS, CONTACT_INFO, formatKSh } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent } from '../ui/ReactBits';
import './Events.css';
import lakesideImg from '../images/lakeside-seating.webp';

const ICONS = {
  Heart,
  Briefcase,
  Sparkles,
  Trees,
  Tent,
  Flower2,
  Volume2,
  Music,
  Lightbulb,
  UtensilsCrossed,
};

const EMPTY_FORM = { guests: '', date: '', name: '', email: '', phone: '', message: '' };

export default function Events() {
  const [activeType, setActiveType] = useState('wedding');
  const [addons, setAddons] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const currentType = EVENT_TYPES.find((t) => t.id === activeType) || EVENT_TYPES[0];
  const CurrentIcon = ICONS[currentType.iconName] || Sparkles;

  const selectedAddons = useMemo(
    () => EVENT_ADDONS.filter((a) => addons.includes(a.id)),
    [addons]
  );
  const total = useMemo(
    () => selectedAddons.reduce((sum, a) => sum + a.price, 0),
    [selectedAddons]
  );

  const today = new Date().toISOString().split('T')[0];

  const toggleAddon = (id) =>
    setAddons((prev) => (prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]));

  const setField = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const selectType = (id) => {
    setActiveType(id);
    // Re-evaluate guest count against the new category's capacity
    if (errors.guests) setErrors((prev) => ({ ...prev, guests: undefined }));
  };

  const validate = () => {
    const e = {};
    const guests = Number(form.guests);
    if (!String(form.guests).trim()) e.guests = 'Enter your expected guest count';
    else if (!Number.isInteger(guests) || guests < currentType.minGuests || guests > currentType.maxGuests)
      e.guests = `${currentType.name} accommodate ${currentType.minGuests}–${currentType.maxGuests} guests`;
    if (!form.date) e.date = 'Choose your event date';
    else if (form.date < today) e.date = 'Event date cannot be in the past';
    if (!form.name.trim()) e.name = 'Your name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    else if (form.phone.replace(/\D/g, '').length < 9) e.phone = 'Enter a valid phone number';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitError('');
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) {
      const first = document.querySelector('.events__field--error input, .events__field--error textarea');
      first?.focus();
      return;
    }

    const addonLabels = selectedAddons.map((a) => `${a.name} (${formatKSh(a.price)})`);
    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/book-meeting`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          eventType: currentType.name,
          fullName: form.name.trim(),
          name: form.name.trim(),
          email: form.email.trim(),
          phone: form.phone.trim(),
          eventDate: form.date,
          date: form.date,
          guests: Number(form.guests),
          details: form.message.trim() || 'Standard event enquiry',
          message: form.message.trim(),
          addons: addonLabels,
          addonIds: selectedAddons.map((a) => a.id),
          estimatedTotal: total,
        }),
      });
      const data = await response.json().catch(() => ({}));
      if (response.ok && data.success) {
        setSubmitted({
          name: form.name.trim(),
          email: form.email.trim(),
          eventTypeName: currentType.name,
          date: form.date,
          guests: Number(form.guests),
          total,
          count: selectedAddons.length,
        });
        setForm(EMPTY_FORM);
        setAddons([]);
      } else {
        setSubmitError(
          data.message || 'We could not submit your enquiry. Please try again in a moment.'
        );
      }
    } catch (error) {
      console.error(error);
      setSubmitError(
        `Unable to reach the events desk right now. Please try again or call ${CONTACT_INFO.phoneDisplay}.`
      );
    } finally {
      setLoading(false);
    }
  };

  const field = (key) => `events__field ${errors[key] ? 'events__field--error' : ''}`;

  return (
    <section id="events" className="events aura-surface-cream">
      <div className="events__hero-banner">
        <img
          src={lakesideImg}
          alt="AdvaBliss Resort grounds and lakeside canopies for weddings and events"
          className="events__hero-img"
          loading="lazy"
        />
        <div className="events__hero-overlay" />
        <div className="container events__hero-content">
          <span className="section-eyebrow light">Celebrations &amp; Gatherings</span>
          <h2 className="section-title light events__hero-title">
            <SplitText text="Crafting Extraordinary" delay={45} />{' '}
            <em>
              <GradientText>Occasions</GradientText>
            </em>
          </h2>
          <p className="section-subtitle light">
            From sunlit garden weddings to executive retreats in Ruiru, our events team orchestrates every detail with poise.
          </p>
        </div>
      </div>

      <div className="container events__body section-pad">
        {/* 01 — Occasion */}
        <div className="events__step-head">
          <span className="events__step-no">01</span>
          <h3>Choose your occasion</h3>
        </div>

        <div className="events__types" role="tablist" aria-label="Event categories">
          {EVENT_TYPES.map((type) => {
            const Icon = ICONS[type.iconName] || Sparkles;
            const isActive = activeType === type.id;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                key={type.id}
                className={`events__type ${isActive ? 'events__type--active' : ''}`}
                onClick={() => selectType(type.id)}
              >
                <Icon size={20} strokeWidth={1.4} />
                <span className="events__type-name">{type.name}</span>
                <span className="events__type-capacity">{type.capacity}</span>
              </button>
            );
          })}
        </div>

        <AnimatedContent key={currentType.id} className="events__spotlight">
          <div className="events__spotlight-head">
            <CurrentIcon size={22} strokeWidth={1.4} />
            <h4>{currentType.name}</h4>
            <span className="events__capacity-tag">
              <Users size={13} />
              {currentType.capacity}
            </span>
          </div>
          <p>{currentType.desc}</p>
          <ul className="events__highlights">
            {currentType.highlights.map((h) => (
              <li key={h}>
                <Check size={13} />
                {h}
              </li>
            ))}
          </ul>
        </AnimatedContent>

        {submitted ? (
          <div className="events__success" role="status">
            <CheckCircle2 size={34} strokeWidth={1.4} />
            <h3>Enquiry received</h3>
            <p>
              Thank you, <strong>{submitted.name}</strong>. Our events desk has your brief for a{' '}
              <strong>{submitted.eventTypeName}</strong> on <strong>{submitted.date}</strong> for{' '}
              <strong>{submitted.guests} guests</strong>
              {submitted.count > 0 && (
                <>
                  {' '}with {submitted.count} enhancement{submitted.count > 1 ? 's' : ''} (
                  <strong>{formatKSh(submitted.total)}</strong>)
                </>
              )}
              , and will reach out to <strong>{submitted.email}</strong> within 24 hours.
            </p>
            <button type="button" className="btn btn-gold" onClick={() => setSubmitted(null)}>
              Plan another event
            </button>
          </div>
        ) : (
          <form className="events__booking" onSubmit={handleSubmit} noValidate>
            <div className="events__steps">
              {/* 02 — Details */}
              <div className="events__step-head">
                <span className="events__step-no">02</span>
                <h3>Event details</h3>
              </div>
              <div className="events__row">
                <div className={field('guests')}>
                  <label htmlFor="ev-guests">Guests</label>
                  <input
                    id="ev-guests"
                    type="number"
                    inputMode="numeric"
                    min={currentType.minGuests}
                    max={currentType.maxGuests}
                    placeholder={`${currentType.minGuests}–${currentType.maxGuests}`}
                    value={form.guests}
                    onChange={(e) => setField('guests', e.target.value)}
                    aria-invalid={!!errors.guests}
                  />
                  <small>{errors.guests || `${currentType.name}: ${currentType.capacity}`}</small>
                </div>
                <div className={field('date')}>
                  <label htmlFor="ev-date">Event date</label>
                  <input
                    id="ev-date"
                    type="date"
                    min={today}
                    value={form.date}
                    onChange={(e) => setField('date', e.target.value)}
                    aria-invalid={!!errors.date}
                  />
                  <small>{errors.date || ' '}</small>
                </div>
              </div>

              {/* 03 — Enhancements */}
              <div className="events__step-head">
                <span className="events__step-no">03</span>
                <h3>
                  Enhance your <em>experience</em>
                </h3>
                <span className="events__optional">Optional</span>
              </div>
              <ul className="events__addons">
                {EVENT_ADDONS.map((addon) => {
                  const Icon = ICONS[addon.iconName] || Sparkles;
                  const on = addons.includes(addon.id);
                  return (
                    <li key={addon.id}>
                      <button
                        type="button"
                        aria-pressed={on}
                        className={`events__addon ${on ? 'events__addon--on' : ''}`}
                        onClick={() => toggleAddon(addon.id)}
                      >
                        <Icon size={18} strokeWidth={1.4} className="events__addon-icon" />
                        <span className="events__addon-name">{addon.name}</span>
                        <span className="events__addon-price">{formatKSh(addon.price)}</span>
                        <span className="events__addon-state" aria-hidden="true">
                          {on ? <Check size={13} /> : <Plus size={13} />}
                        </span>
                        <span className="sr-only">{on ? 'Selected' : 'Not selected'}</span>
                      </button>
                    </li>
                  );
                })}
              </ul>

              {/* 04 — Contact */}
              <div className="events__step-head">
                <span className="events__step-no">04</span>
                <h3>Your details</h3>
              </div>
              <div className="events__row">
                <div className={field('name')}>
                  <label htmlFor="ev-name">Full name</label>
                  <input
                    id="ev-name"
                    type="text"
                    autoComplete="name"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                    aria-invalid={!!errors.name}
                  />
                  <small>{errors.name || ' '}</small>
                </div>
                <div className={field('phone')}>
                  <label htmlFor="ev-phone">Phone</label>
                  <input
                    id="ev-phone"
                    type="tel"
                    autoComplete="tel"
                    placeholder="+254 …"
                    value={form.phone}
                    onChange={(e) => setField('phone', e.target.value)}
                    aria-invalid={!!errors.phone}
                  />
                  <small>{errors.phone || ' '}</small>
                </div>
              </div>
              <div className={field('email')}>
                <label htmlFor="ev-email">Email</label>
                <input
                  id="ev-email"
                  type="email"
                  autoComplete="email"
                  value={form.email}
                  onChange={(e) => setField('email', e.target.value)}
                  aria-invalid={!!errors.email}
                />
                <small>{errors.email || ' '}</small>
              </div>
              <div className="events__field">
                <label htmlFor="ev-message">Vision &amp; requirements (optional)</label>
                <textarea
                  id="ev-message"
                  rows={4}
                  placeholder="Preferred setup, catering style, or questions for our coordinator…"
                  value={form.message}
                  onChange={(e) => setField('message', e.target.value)}
                />
              </div>
            </div>

            {/* Summary */}
            <aside className="events__summary" aria-label="Booking summary">
              <span className="section-eyebrow light">Booking summary</span>
              <dl>
                <div>
                  <dt>Occasion</dt>
                  <dd>{currentType.name}</dd>
                </div>
                <div>
                  <dt>Guests</dt>
                  <dd>{form.guests ? form.guests : '—'}</dd>
                </div>
                <div>
                  <dt>Date</dt>
                  <dd>{form.date || '—'}</dd>
                </div>
              </dl>

              <div className="events__summary-lines" aria-live="polite">
                {selectedAddons.length === 0 ? (
                  <p className="events__summary-empty">No enhancements selected.</p>
                ) : (
                  selectedAddons.map((a) => (
                    <div key={a.id} className="events__summary-line">
                      <span>{a.name}</span>
                      <span>{formatKSh(a.price)}</span>
                    </div>
                  ))
                )}
              </div>

              <div className="events__summary-total">
                <span>Enhancements total</span>
                <strong aria-live="polite">{formatKSh(total)}</strong>
              </div>
              <p className="events__summary-note">
                Estimate covers selected enhancements only. Venue and final pricing are confirmed by our events desk.
              </p>

              {submitError && (
                <div className="events__alert" role="alert">
                  <AlertCircle size={16} />
                  <span>{submitError}</span>
                </div>
              )}
              {Object.keys(errors).filter((k) => errors[k]).length > 0 && (
                <div className="events__alert" role="alert">
                  <AlertCircle size={16} />
                  <span>Please correct the highlighted fields.</span>
                </div>
              )}

              <button type="submit" className="btn btn-gold events__submit" disabled={loading}>
                {loading ? (
                  <>
                    <span className="ui-spinner" />
                    <span>Submitting…</span>
                  </>
                ) : (
                  <>
                    <Send size={15} />
                    <span>Submit enquiry</span>
                  </>
                )}
              </button>
            </aside>
          </form>
        )}
      </div>
    </section>
  );
}
