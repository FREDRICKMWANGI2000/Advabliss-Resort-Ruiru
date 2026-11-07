import React, { useState } from 'react';
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
} from 'lucide-react';
import { EVENT_TYPES, EVENT_ADDONS, CONTACT_INFO } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
import './Events.css';
import lakesideImg from '../images/lakeside-seating.webp';
import entranceImg from '../images/logo1.png';

const EVENT_ICON_MAP = {
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

export default function Events() {
  const [activeType, setActiveType] = useState('wedding');
  const [addons, setAddons] = useState([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    date: '',
    guests: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedEnquiry, setSubmittedEnquiry] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const toggleAddon = (id) =>
    setAddons((prev) =>
      prev.includes(id) ? prev.filter((a) => a !== id) : [...prev, id]
    );

  const totalAddons = addons.reduce(
    (s, id) => s + (EVENT_ADDONS.find((a) => a.id === id)?.price || 0),
    0
  );

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Contact name is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.date) e.date = 'Event date is required';
    if (!String(form.guests).trim()) e.guests = 'Estimated guest count is required';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitError('');

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    const selectedTypeObj = EVENT_TYPES.find((t) => t.id === activeType);
    const selectedAddonNames = addons
      .map((id) => EVENT_ADDONS.find((a) => a.id === id)?.name)
      .filter(Boolean);

    const detailsSummary = [
      form.message.trim(),
      selectedAddonNames.length > 0
        ? `Selected Add-Ons ($${totalAddons}): ${selectedAddonNames.join(', ')}`
        : '',
    ]
      .filter(Boolean)
      .join(' | ');

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/book-meeting`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          eventType: selectedTypeObj?.name || activeType,
          fullName: form.name,
          name: form.name,
          email: form.email,
          phone: form.phone,
          eventDate: form.date,
          date: form.date,
          guests: form.guests,
          details: detailsSummary || 'Standard event enquiry',
          message: form.message,
          addons: selectedAddonNames,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmittedEnquiry({
          name: form.name,
          email: form.email,
          eventTypeName: selectedTypeObj?.name || 'Event',
          date: form.date,
          guests: form.guests,
        });
        setForm({
          name: '',
          email: '',
          phone: '',
          date: '',
          guests: '',
          message: '',
        });
        setAddons([]);
      } else {
        setSubmitError('Could not complete enquiry submission. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setSubmitError(
        'Unable to reach the events desk right now. Please try again or call ' +
          CONTACT_INFO.phoneDisplay
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];
  const currentType = EVENT_TYPES.find((t) => t.id === activeType) || EVENT_TYPES[0];
  const CurrentTypeIcon = EVENT_ICON_MAP[currentType.iconName] || Sparkles;

  return (
    <section id="events" className="events aura-surface-cream">
      {/* Immersive Editorial Hero Banner */}
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
            From sunlit garden weddings and milestone family celebrations to executive corporate retreats in Ruiru, our events team orchestrates every detail with poise.
          </p>
        </div>
      </div>

      <div className="container events__body section-pad">
        {/* Event Category Selector */}
        <div className="events__types" role="tablist" aria-label="Event categories">
          {EVENT_TYPES.map((type) => {
            const IconComp = EVENT_ICON_MAP[type.iconName] || Sparkles;
            const isActive = activeType === type.id;
            return (
              <button
                type="button"
                role="tab"
                aria-selected={isActive}
                key={type.id}
                className={`events__type-card ${isActive ? 'events__type-card--active' : ''}`}
                onClick={() => setActiveType(type.id)}
              >
                <span className="events__type-icon">
                  <IconComp size={20} strokeWidth={1.6} />
                </span>
                <div className="events__type-name">{type.name}</div>
                <div className="events__type-capacity">{type.capacity}</div>
              </button>
            );
          })}
        </div>

        {/* Active Event Editorial Spotlight */}
        <AnimatedContent key={currentType.id} className="events__spotlight">
          <div className="events__spotlight-icon">
            <CurrentTypeIcon size={26} strokeWidth={1.5} />
          </div>
          <div className="events__spotlight-copy">
            <div className="events__spotlight-top">
              <h3>{currentType.name}</h3>
              <span className="events__capacity-tag">
                <Users size={13} />
                <span>{currentType.capacity}</span>
              </span>
            </div>
            <p>{currentType.desc}</p>
          </div>
        </AnimatedContent>

        {/* Bespoke Event Add-Ons Configurator */}
        <div className="events__addons-section">
          <div className="editorial-header-split">
            <div>
              <span className="section-eyebrow">Tailored Production</span>
              <h3 className="section-title" style={{ fontSize: 'clamp(1.9rem, 3vw, 2.75rem)' }}>
                Enhance Your <em>Experience</em>
              </h3>
            </div>
            <p className="section-subtitle">
              Select optional production, floral styling, sound, and culinary enhancements to include in your event brief.
            </p>
          </div>

          <div className="events__addons-grid">
            {EVENT_ADDONS.map((addon) => {
              const AddonIcon = EVENT_ICON_MAP[addon.iconName] || Sparkles;
              const isSelected = addons.includes(addon.id);
              return (
                <button
                  type="button"
                  key={addon.id}
                  aria-pressed={isSelected}
                  className={`events__addon ${isSelected ? 'events__addon--selected' : ''}`}
                  onClick={() => toggleAddon(addon.id)}
                >
                  <div className="events__addon-top">
                    <span className="events__addon-icon">
                      <AddonIcon size={18} strokeWidth={1.6} />
                    </span>
                    <span className="events__addon-price">+${addon.price}</span>
                  </div>
                  <div className="events__addon-name">{addon.name}</div>
                  {isSelected && (
                    <div className="events__addon-check" aria-hidden="true">
                      <Check size={12} />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {addons.length > 0 && (
            <div className="events__addon-total">
              <span>
                Selected Enhancements ({addons.length}):{' '}
                {addons
                  .map((id) => EVENT_ADDONS.find((a) => a.id === id)?.name)
                  .join(' · ')}
              </span>
              <strong>+${totalAddons.toLocaleString()}</strong>
            </div>
          )}
        </div>

        {/* Event Enquiry Form */}
        <div className="events__form-wrap">
          <div className="events__form-left aura-surface-dark">
            <div className="events__form-logo-banner">
              <img
                src={entranceImg}
                alt="AdvaBliss Resort — A Taste of Paradise"
                className="events__form-logo-img"
                loading="lazy"
              />
            </div>
            <div className="events__form-info">
              <span className="section-eyebrow light">Event Concierge</span>
              <h4>Why Host at AdvaBliss?</h4>
              <p className="events__form-desc">
                From landmark garden weddings to corporate retreats, our dedicated banquet team orchestrates seamless experiences tailored to your vision.
              </p>
              <ul>
                {[
                  'Dedicated on-site event coordinator',
                  'In-house culinary & banquet team',
                  'Flexible milestone payment plans',
                  'Attentive hospitality & security staff',
                  'Full audiovisual & tenting support',
                  'Complimentary pre-event site walk-through',
                ].map((f) => (
                  <li key={f}>
                    <Check size={14} />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="events__form-right">
            <span className="section-eyebrow">Event Brief</span>
            <h3 className="events__form-title">Plan Your Gathering</h3>
            <p className="events__form-sub">
              Share your preferred date and guest count for a tailored venue proposal.
            </p>

            {loading && (
              <div className="ui-progress-bar" role="progressbar" aria-label="Submitting event enquiry">
                <div className="ui-progress-bar__fill" />
              </div>
            )}

            {submitError && (
              <div className="form-banner form-banner--error" role="alert">
                <AlertCircle size={18} />
                <span>{submitError}</span>
              </div>
            )}

            {submittedEnquiry ? (
              <div className="accom__success">
                <div className="accom__success-icon">
                  <CheckCircle2 size={30} />
                </div>
                <h3>Event Enquiry Received</h3>
                <p>
                  Thank you, <strong>{submittedEnquiry.name}</strong>. Our events desk has received your brief for a{' '}
                  <strong>{submittedEnquiry.eventTypeName}</strong> on{' '}
                  <strong>{submittedEnquiry.date}</strong> ({submittedEnquiry.guests} guests) and will reach out to{' '}
                  <strong>{submittedEnquiry.email}</strong> within 24 hours.
                </p>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => setSubmittedEnquiry(null)}
                >
                  Submit Another Enquiry
                </button>
              </div>
            ) : (
              <form className="events__form" onSubmit={handleSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Selected Event Category</label>
                  <div className="events__selected-type">
                    <CurrentTypeIcon size={16} />
                    <span>{currentType.name}</span>
                    <span className="events__selected-cap">({currentType.capacity})</span>
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ev-name" className="form-label">
                    Your Full Name *
                  </label>
                  <input
                    id="ev-name"
                    className={`form-input ${errors.name ? 'error' : ''}`}
                    placeholder="Full name or organisation"
                    value={form.name}
                    onChange={(e) => setField('name', e.target.value)}
                  />
                  {errors.name && <span className="form-error">{errors.name}</span>}
                </div>

                <div className="events__form-row">
                  <div className="form-group">
                    <label htmlFor="ev-email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      id="ev-email"
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="your@email.com"
                      value={form.email}
                      onChange={(e) => setField('email', e.target.value)}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="ev-phone" className="form-label">
                      Phone Number *
                    </label>
                    <input
                      id="ev-phone"
                      type="tel"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="0748935428"
                      value={form.phone}
                      onChange={(e) => setField('phone', e.target.value)}
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>
                </div>

                <div className="events__form-row">
                  <div className="form-group">
                    <label htmlFor="ev-date" className="form-label">
                      Preferred Date *
                    </label>
                    <input
                      id="ev-date"
                      type="date"
                      className={`form-input ${errors.date ? 'error' : ''}`}
                      min={today}
                      value={form.date}
                      onChange={(e) => setField('date', e.target.value)}
                    />
                    {errors.date && <span className="form-error">{errors.date}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="ev-guests" className="form-label">
                      Estimated Guests *
                    </label>
                    <input
                      id="ev-guests"
                      type="number"
                      className={`form-input ${errors.guests ? 'error' : ''}`}
                      placeholder="e.g. 150"
                      min="1"
                      value={form.guests}
                      onChange={(e) => setField('guests', e.target.value)}
                    />
                    {errors.guests && <span className="form-error">{errors.guests}</span>}
                  </div>
                </div>

                <div className="form-group">
                  <label htmlFor="ev-message" className="form-label">
                    Event Vision &amp; Requirements
                  </label>
                  <textarea
                    id="ev-message"
                    className="form-textarea"
                    placeholder="Share your preferred setup, catering style, or any questions for our coordinator…"
                    value={form.message}
                    onChange={(e) => setField('message', e.target.value)}
                  />
                </div>

                {addons.length > 0 && (
                  <div className="events__form-addons-summary">
                    <strong>Included Add-Ons (+${totalAddons}):</strong>{' '}
                    {addons
                      .map((id) => EVENT_ADDONS.find((a) => a.id === id)?.name)
                      .join(', ')}
                  </div>
                )}

                <button
                  type="submit"
                  className="btn btn-gold events__form-submit"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="ui-spinner" />
                      <span>Submitting Brief…</span>
                    </>
                  ) : (
                    <>
                      <Send size={15} />
                      <span>Submit Event Enquiry</span>
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
