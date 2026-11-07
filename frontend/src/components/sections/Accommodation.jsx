import React, { useState } from 'react';
import {
  Users,
  Check,
  Send,
  ShieldCheck,
  Sparkles,
  Calendar,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react';
import { ACCOMMODATIONS, CONTACT_INFO } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent, ScrollExpandImage } from '../ui/ReactBits';
import './Accommodation.css';
import axios from 'axios';

function useForm(init) {
  const [values, setValues] = useState(init);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const set = (k, v) => setValues((p) => ({ ...p, [k]: v }));
  return { values, setValues, errors, setErrors, set, loading, setLoading };
}

function isValidKenyanPhone(phone) {
  const cleaned = String(phone).replace(/[\s\-()]/g, '');
  return /^(\+?254|0)?[17]\d{8}$/.test(cleaned) || /^\+?\d{9,15}$/.test(cleaned);
}

export default function Accommodation() {
  const { values, setValues, errors, setErrors, set, loading, setLoading } = useForm({
    fullName: '',
    accommodationType: 'deluxe',
    checkIn: '',
    checkOut: '',
    adults: 2,
    children: 0,
    phone: '',
    email: '',
  });

  const [selected, setSelected] = useState('deluxe');
  const [submittedGuest, setSubmittedGuest] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const activeRoom =
    ACCOMMODATIONS.find((r) => r.id === (values.accommodationType || selected)) ||
    ACCOMMODATIONS[1];

  const selectRoomAndScroll = (roomId, shouldScroll = false) => {
    setSelected(roomId);
    set('accommodationType', roomId);
    if (shouldScroll) {
      const formEl = document.getElementById('accommodation-form');
      if (formEl) {
        window.scrollTo({
          top: formEl.getBoundingClientRect().top + window.scrollY - 90,
          behavior: 'smooth',
        });
      }
    }
  };

  const validate = (vals) => {
    const e = {};
    if (!vals.fullName.trim()) e.fullName = 'Full name is required';
    if (!vals.accommodationType) e.accommodationType = 'Please select a room or suite';
    if (!vals.checkIn) e.checkIn = 'Check-in date required';
    if (!vals.checkOut) e.checkOut = 'Check-out date required';
    if (vals.checkIn && vals.checkOut && vals.checkIn >= vals.checkOut) {
      e.checkOut = 'Check-out must be after check-in';
    }
    if (!vals.phone.trim()) {
      e.phone = 'Phone number required';
    } else if (!isValidKenyanPhone(vals.phone)) {
      e.phone = 'Enter a valid phone number (e.g. 0794400999 or +254 794400999)';
    }
    if (!vals.email.trim()) {
      e.email = 'Email address required';
    } else if (!/\S+@\S+\.\S+/.test(vals.email)) {
      e.email = 'Enter a valid email address';
    }
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    const validationErrors = validate(values);
    setErrors(validationErrors);
    if (Object.keys(validationErrors).length > 0) return;

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      await axios.post(`${apiBase}/api/book-accommodation`, {
        fullName: values.fullName,
        accommodationType: values.accommodationType,
        checkInDate: values.checkIn,
        checkOutDate: values.checkOut,
        adults: values.adults,
        children: values.children,
        phone: values.phone,
        email: values.email,
      });

      setSubmittedGuest({
        fullName: values.fullName,
        email: values.email,
        roomName: activeRoom?.name || values.accommodationType,
        checkIn: values.checkIn,
        checkOut: values.checkOut,
      });
    } catch (err) {
      console.error(err);
      setSubmitError(
        'We could not transmit your reservation request right now. Please try again or reach our desk directly at ' +
          CONTACT_INFO.phoneDisplay
      );
    } finally {
      setLoading(false);
    }
  };

  const today = new Date().toISOString().split('T')[0];

  // Calculate nights if valid dates chosen
  const nightsCount =
    values.checkIn && values.checkOut && values.checkOut > values.checkIn
      ? Math.max(
          1,
          Math.round(
            (new Date(values.checkOut).getTime() - new Date(values.checkIn).getTime()) /
              (1000 * 60 * 60 * 24)
          )
        )
      : 1;

  return (
    <section id="accommodation" className="accommodation aura-surface-cream section-pad">
      <div className="container">
        {/* Editorial Split Section Header */}
        <div className="editorial-header-split">
          <div>
            <span className="section-eyebrow">Residences &amp; Suites</span>
            <h2 className="section-title">
              <SplitText text="Restful Quarters Framed" delay={45} />{' '}
              <em>
                <GradientText variant="dark">By Nature</GradientText>
              </em>
            </h2>
          </div>
          <p className="section-subtitle">
            From sunlit garden-view rooms to multi-bedroom family residences and all-inclusive celebration suites, each space is designed for quiet comfort in Ruiru.
          </p>
        </div>

        {/* Room & Suite Selection Cards */}
        <div className="accom__rooms">
          {ACCOMMODATIONS.map((room, idx) => {
            const isSelected = selected === room.id;
            return (
              <AnimatedContent
                key={room.id}
                delay={idx * 70}
                className={`accom__card ${isSelected ? 'accom__card--selected' : ''}`}
              >
                <div
                  className="accom__card-interactive"
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  onClick={() => selectRoomAndScroll(room.id, false)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      selectRoomAndScroll(room.id, false);
                    }
                  }}
                >
                  <div className="accom__card-media">
                    {room.badge && <span className="accom__badge">{room.badge}</span>}
                    <ScrollExpandImage
                      src={room.image}
                      alt={room.name}
                      className="accom__card-img-wrap"
                    />
                  </div>

                  <div className="accom__card-body">
                    <div className="accom__card-meta-row">
                      <span className="accom__card-type">{room.type}</span>
                      <span className="accom__capacity">
                        <Users size={13} />
                        <span>Up to {room.capacity} guests</span>
                      </span>
                    </div>

                    <h3 className="accom__card-name">{room.name}</h3>
                    <p className="accom__card-desc">{room.description}</p>

                    <ul className="accom__feature-list" aria-label={`${room.name} amenities`}>
                      {room.features.map((f) => (
                        <li key={f} className="accom__feature-pill">
                          <Check size={11} />
                          <span>{f}</span>
                        </li>
                      ))}
                    </ul>

                    <div className="accom__card-footer">
                      <div className="accom__price">
                        <span className="accom__price-from">Nightly Rate</span>
                        <div className="accom__price-line">
                          <span className="accom__price-val">
                            KES {room.price.toLocaleString('en-KE')}
                          </span>
                          <span className="accom__price-per">/ night</span>
                        </div>
                      </div>

                      <button
                        type="button"
                        className={`btn accom__select-btn ${
                          isSelected ? 'btn-forest' : 'btn-outline-gold'
                        }`}
                        onClick={(e) => {
                          e.stopPropagation();
                          selectRoomAndScroll(room.id, true);
                        }}
                      >
                        {isSelected ? (
                          <>
                            <Check size={14} />
                            <span>Selected</span>
                          </>
                        ) : (
                          <span>Select Suite</span>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              </AnimatedContent>
            );
          })}
        </div>

        {/* Two-Column Concierge Reservation Desk */}
        <div className="accom__desk" id="accommodation-form">
          {/* Left: Selected Residence Summary */}
          <div className="accom__desk-summary aura-surface-dark">
            <span className="section-eyebrow light">Selected Residence</span>
            <h3 className="accom__summary-title">{activeRoom.name}</h3>
            <p className="accom__summary-desc">{activeRoom.description}</p>

            <div className="accom__summary-img-wrap">
              <img src={activeRoom.image} alt={activeRoom.name} loading="lazy" />
            </div>

            <div className="accom__summary-Ledger">
              <div className="accom__ledger-row">
                <span>Category</span>
                <strong>{activeRoom.type}</strong>
              </div>
              <div className="accom__ledger-row">
                <span>Occupancy</span>
                <strong>Up to {activeRoom.capacity} Guests</strong>
              </div>
              <div className="accom__ledger-row">
                <span>Nightly Tariff</span>
                <strong>KES {activeRoom.price.toLocaleString('en-KE')}</strong>
              </div>
              <div className="accom__ledger-row accom__ledger-row--total">
                <span>Estimated ({nightsCount} {nightsCount === 1 ? 'Night' : 'Nights'})</span>
                <strong>KES {(activeRoom.price * nightsCount).toLocaleString('en-KE')}</strong>
              </div>
            </div>

            <div className="accom__guarantees">
              <div>
                <ShieldCheck size={15} />
                <span>Direct Resort Rate</span>
              </div>
              <div>
                <Sparkles size={15} />
                <span>Flexible 48h Cancellation</span>
              </div>
            </div>
          </div>

          {/* Right: Reservation Form */}
          <div className="accom__desk-form-wrap">
            <div className="accom__form-header">
              <span className="section-eyebrow">Reservation Desk</span>
              <h3 className="accom__form-title">Complete Your Stay Request</h3>
              <p className="accom__form-sub">
                Submit your preferred dates and our reservations desk will confirm availability directly via email and phone.
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

            {submittedGuest ? (
              <div className="accom__success">
                <div className="accom__success-icon">
                  <CheckCircle2 size={32} />
                </div>
                <h3>Reservation Request Received</h3>
                <p>
                  Thank you, <strong>{submittedGuest.fullName}</strong>. Our reservations team has received your request for the{' '}
                  <strong>{submittedGuest.roomName}</strong> ({submittedGuest.checkIn} to {submittedGuest.checkOut}) and will contact you at{' '}
                  <strong>{submittedGuest.email}</strong> within 2 hours.
                </p>
                <button
                  type="button"
                  className="btn btn-gold"
                  onClick={() => {
                    setSubmittedGuest(null);
                    setValues({
                      fullName: '',
                      accommodationType: selected,
                      checkIn: '',
                      checkOut: '',
                      adults: 2,
                      children: 0,
                      phone: '',
                      email: '',
                    });
                  }}
                >
                  Make Another Reservation
                </button>
              </div>
            ) : (
              <form className="accom__form" onSubmit={handleSubmit} noValidate>
                <div className="accom__form-grid">
                  <div className="form-group">
                    <label htmlFor="accom-fullName" className="form-label">
                      Guest Full Name *
                    </label>
                    <input
                      id="accom-fullName"
                      className={`form-input ${errors.fullName ? 'error' : ''}`}
                      placeholder="e.g. Wanjiku Mwangi"
                      value={values.fullName}
                      onChange={(e) => set('fullName', e.target.value)}
                    />
                    {errors.fullName && <span className="form-error">{errors.fullName}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="accom-type" className="form-label">
                      Residence Selection *
                    </label>
                    <select
                      id="accom-type"
                      className={`form-select ${errors.accommodationType ? 'error' : ''}`}
                      value={values.accommodationType}
                      onChange={(e) => {
                        set('accommodationType', e.target.value);
                        setSelected(e.target.value);
                      }}
                    >
                      <option value="">— Select room or suite —</option>
                      {ACCOMMODATIONS.map((r) => (
                        <option key={r.id} value={r.id}>
                          {r.name} — KES {r.price.toLocaleString('en-KE')} / night
                        </option>
                      ))}
                    </select>
                    {errors.accommodationType && (
                      <span className="form-error">{errors.accommodationType}</span>
                    )}
                  </div>

                  <div className="form-group">
                    <label htmlFor="accom-checkIn" className="form-label">
                      Check-In Date *
                    </label>
                    <input
                      id="accom-checkIn"
                      type="date"
                      className={`form-input ${errors.checkIn ? 'error' : ''}`}
                      min={today}
                      value={values.checkIn}
                      onChange={(e) => set('checkIn', e.target.value)}
                    />
                    {errors.checkIn && <span className="form-error">{errors.checkIn}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="accom-checkOut" className="form-label">
                      Check-Out Date *
                    </label>
                    <input
                      id="accom-checkOut"
                      type="date"
                      className={`form-input ${errors.checkOut ? 'error' : ''}`}
                      min={values.checkIn || today}
                      value={values.checkOut}
                      onChange={(e) => set('checkOut', e.target.value)}
                    />
                    {errors.checkOut && <span className="form-error">{errors.checkOut}</span>}
                  </div>

                  <div className="form-group">
                    <label className="form-label">Adults</label>
                    <div className="accom__counter">
                      <button
                        type="button"
                        className="accom__counter-btn"
                        aria-label="Decrease adults"
                        onClick={() => set('adults', Math.max(1, values.adults - 1))}
                      >
                        −
                      </button>
                      <span className="accom__counter-val">{values.adults}</span>
                      <button
                        type="button"
                        className="accom__counter-btn"
                        aria-label="Increase adults"
                        onClick={() => set('adults', Math.min(10, values.adults + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Children (Under 12)</label>
                    <div className="accom__counter">
                      <button
                        type="button"
                        className="accom__counter-btn"
                        aria-label="Decrease children"
                        onClick={() => set('children', Math.max(0, values.children - 1))}
                      >
                        −
                      </button>
                      <span className="accom__counter-val">{values.children}</span>
                      <button
                        type="button"
                        className="accom__counter-btn"
                        aria-label="Increase children"
                        onClick={() => set('children', Math.min(8, values.children + 1))}
                      >
                        +
                      </button>
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="accom-phone" className="form-label">
                      Phone Number *
                    </label>
                    <input
                      id="accom-phone"
                      type="tel"
                      className={`form-input ${errors.phone ? 'error' : ''}`}
                      placeholder="+254 748 935 428 or 0748935428"
                      value={values.phone}
                      onChange={(e) => set('phone', e.target.value)}
                    />
                    {errors.phone && <span className="form-error">{errors.phone}</span>}
                  </div>

                  <div className="form-group">
                    <label htmlFor="accom-email" className="form-label">
                      Email Address *
                    </label>
                    <input
                      id="accom-email"
                      type="email"
                      className={`form-input ${errors.email ? 'error' : ''}`}
                      placeholder="guest@domain.com"
                      value={values.email}
                      onChange={(e) => set('email', e.target.value)}
                    />
                    {errors.email && <span className="form-error">{errors.email}</span>}
                  </div>

                  <div className="accom__form-actions accom__span-2">
                    <button
                      type="submit"
                      className="btn btn-gold accom__submit-btn"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <span className="ui-spinner" />
                          <span>Transmitting Request…</span>
                        </>
                      ) : (
                        <>
                          <Calendar size={15} />
                          <span>Request Availability &amp; Reserve</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
