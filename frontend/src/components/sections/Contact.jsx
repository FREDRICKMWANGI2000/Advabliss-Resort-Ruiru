import React, { useState } from 'react';
import {
  Phone,
  Mail,
  MapPin,
  Send,
  MessageCircle,
  ArrowUpRight,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';
import { CONTACT_INFO } from '../../data/siteData';
import { SplitText, GradientText, AnimatedContent } from '../ui/ReactBits';
import './Contact.css';

export default function Contact() {
  const [form, setForm] = useState({
    name: '',
    phone: '',
    email: '',
    message: '',
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submittedDetails, setSubmittedDetails] = useState(null);
  const [submitError, setSubmitError] = useState('');

  const setField = (k, v) => setForm((p) => ({ ...p, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = 'Your name is required';
    if (!form.phone.trim()) e.phone = 'Phone number is required';
    if (!form.email.trim()) e.email = 'Email address is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Enter a valid email address';
    if (!form.message.trim()) e.message = 'Please enter your message';
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setSubmitError('');

    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setLoading(true);
    try {
      const apiBase = import.meta.env.VITE_API_URL || '';
      const response = await fetch(`${apiBase}/api/contact`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: form.name,
          phone: form.phone,
          email: form.email,
          message: form.message,
        }),
      });

      const data = await response.json();
      if (data.success) {
        setSubmittedDetails({
          name: form.name,
          email: form.email,
        });
        setForm({
          name: '',
          phone: '',
          email: '',
          message: '',
        });
      } else {
        setSubmitError('Failed to send message. Please try again.');
      }
    } catch (error) {
      console.error(error);
      setSubmitError(
        'Could not send your message right now. Please try again or reach us at ' +
          CONTACT_INFO.phoneDisplay
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="contact" className="contact aura-surface-cream section-pad">
      <div className="container">
        <div className="editorial-header-split">
          <div>
            <h2 className="section-title">
              <SplitText text="Connect With" delay={45} />{' '}
              <em>
                <span className="highlight-marker"><GradientText variant="dark">AdvaBliss Ruiru</GradientText></span>
              </em>
            </h2>
          </div>
          <p className="section-subtitle">
            Our reservations and events concierge desk is available around the clock to assist with room bookings, private dining, site visits, and bespoke celebrations.
          </p>
        </div>

        <div className="contact__grid">
          {/* Left: Direct Channels & Map */}
          <AnimatedContent className="contact__left">
            <div className="contact__info-cards">
              <a
                href={`tel:${CONTACT_INFO.phone.replace(/\s+/g, '')}`}
                className="contact__info-card"
              >
                <div className="contact__info-icon">
                  <Phone size={18} strokeWidth={1.7} />
                </div>
                <div>
                  <div className="contact__info-label">Telephone Desk</div>
                  <div className="contact__info-value">{CONTACT_INFO.phoneDisplay}</div>
                  <div className="contact__info-sub">Available 24/7</div>
                </div>
              </a>

              <a href={`mailto:${CONTACT_INFO.email}`} className="contact__info-card">
                <div className="contact__info-icon">
                  <Mail size={18} strokeWidth={1.7} />
                </div>
                <div>
                  <div className="contact__info-label">Reservations Email</div>
                  <div className="contact__info-value">{CONTACT_INFO.email}</div>
                  <div className="contact__info-sub">Replies within 2 hours</div>
                </div>
              </a>

              <a
                href={CONTACT_INFO.socials.whatsapp}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__info-card"
              >
                <div className="contact__info-icon contact__info-icon--green">
                  <MessageCircle size={18} strokeWidth={1.7} />
                </div>
                <div>
                  <div className="contact__info-label">WhatsApp Concierge</div>
                  <div className="contact__info-value">Chat With Us Directly</div>
                  <div className="contact__info-sub">Instant guest support</div>
                </div>
              </a>

              <div className="contact__info-card">
                <div className="contact__info-icon contact__info-icon--gold">
                  <MapPin size={18} strokeWidth={1.7} />
                </div>
                <div>
                  <div className="contact__info-label">Location</div>
                  <div className="contact__info-value">{CONTACT_INFO.address}</div>
                  <a
                    href={CONTACT_INFO.mapUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact__info-sub contact__info-link"
                  >
                    <span>Directions on Google Maps</span>
                    <ArrowUpRight size={12} />
                  </a>
                </div>
              </div>
            </div>

            {/* Embedded Google Map */}
            <div className="contact__map-wrap">
              <iframe
                title="AdvaBliss Resort Ruiru Location Map"
                src={CONTACT_INFO.mapEmbed}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="contact__map"
              />
              <a
                href={CONTACT_INFO.mapUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="contact__map-overlay-btn"
              >
                <span>Open in Google Maps</span>
                <ArrowUpRight size={13} />
              </a>
            </div>
          </AnimatedContent>

          {/* Right: Direct Message Form */}
          <AnimatedContent delay={120} className="contact__right">
            <div className="contact__form-wrap">
              <h3 className="contact__form-title">Send Us a Message</h3>
              <p className="contact__form-sub">
                Tell us about your upcoming stay, group dining request, or celebration plans.
              </p>

              {loading && (
                <div className="ui-progress-bar" role="progressbar" aria-label="Sending message">
                  <div className="ui-progress-bar__fill" />
                </div>
              )}

              {submitError && (
                <div className="form-banner form-banner--error" role="alert">
                  <AlertCircle size={18} />
                  <span>{submitError}</span>
                </div>
              )}

              {submittedDetails ? (
                <div className="contact__success">
                  <div className="accom__success-icon">
                    <CheckCircle2 size={30} />
                  </div>
                  <h4>Message Received</h4>
                  <p>
                    Thank you, <strong>{submittedDetails.name}</strong>! Our hospitality team has received your enquiry and will respond to{' '}
                    <strong>{submittedDetails.email}</strong> within 2 hours.
                  </p>
                  <button
                    type="button"
                    className="btn btn-outline-gold"
                    onClick={() => setSubmittedDetails(null)}
                  >
                    Send Another Message
                  </button>
                </div>
              ) : (
                <form className="contact__form" onSubmit={handleSubmit} noValidate>
                  <div className="form-group">
                    <label htmlFor="contact-name" className="form-label">
                      Your Name *
                    </label>
                    <input
                      id="contact-name"
                      className={`form-input ${errors.name ? 'error' : ''}`}
                      placeholder="Your full name"
                      value={form.name}
                      onChange={(e) => setField('name', e.target.value)}
                    />
                    {errors.name && <span className="form-error">{errors.name}</span>}
                  </div>

                  <div className="contact__form-row">
                    <div className="form-group">
                      <label htmlFor="contact-phone" className="form-label">
                        Phone Number *
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        className={`form-input ${errors.phone ? 'error' : ''}`}
                        placeholder="0748935428"
                        value={form.phone}
                        onChange={(e) => setField('phone', e.target.value)}
                      />
                      {errors.phone && <span className="form-error">{errors.phone}</span>}
                    </div>

                    <div className="form-group">
                      <label htmlFor="contact-email" className="form-label">
                        Email Address *
                      </label>
                      <input
                        id="contact-email"
                        type="email"
                        className={`form-input ${errors.email ? 'error' : ''}`}
                        placeholder="your@email.com"
                        value={form.email}
                        onChange={(e) => setField('email', e.target.value)}
                      />
                      {errors.email && <span className="form-error">{errors.email}</span>}
                    </div>
                  </div>

                  <div className="form-group">
                    <label htmlFor="contact-message" className="form-label">
                      Message *
                    </label>
                    <textarea
                      id="contact-message"
                      className={`form-textarea ${errors.message ? 'error' : ''}`}
                      placeholder="How may our hospitality team assist you?"
                      rows={6}
                      value={form.message}
                      onChange={(e) => setField('message', e.target.value)}
                    />
                    {errors.message && <span className="form-error">{errors.message}</span>}
                  </div>

                  <button
                    type="submit"
                    className="btn btn-gold contact__submit"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <span className="ui-spinner" />
                        <span>Dispatching Message…</span>
                      </>
                    ) : (
                      <>
                        <Send size={15} />
                        <span>Send Message</span>
                      </>
                    )}
                  </button>
                </form>
              )}
            </div>
          </AnimatedContent>
        </div>
      </div>
    </section>
  );
}
