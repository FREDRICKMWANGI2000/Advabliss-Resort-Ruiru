import React, { useState } from 'react';
import { Utensils, Wine, Sun, Home as HomeIcon } from 'lucide-react';
import { Phone, Mail, MapPin, Send, MessageCircle } from 'lucide-react';
import { MENU_CATEGORIES } from '../../data/siteData';
import './Restaurant.css';
import tableImg from "../images/table.jpg";
import axios from "axios";

export default function Restaurant() {
  const [activeTab, setActiveTab] = useState('starters');
  const [values, setValues] = useState({
  fullName: "",
  date: "",
  time: "",
  guests: "2 Guests",
  occasion: "None",
  phone: "",
  email: "",
});

const [loading, setLoading] = useState(false);
const [submitted, setSubmitted] = useState(false);
  const [resForm, setResForm] = useState({ name: '', date: '', time: '', guests: 2, phone: '', email: '', occasion: '' });
  const [resErrors, setResErrors] = useState({});
  const [resSubmitted, setResSubmitted] = useState(false);

  const tabs = Object.entries(MENU_CATEGORIES);
  const today = new Date().toISOString().split('T')[0];

  const setField = (k, v) => setResForm(p => ({ ...p, [k]: v }));

  const validateRes = () => {
    const e = {};
    if (!resForm.name.trim()) e.name = 'Name required';
    if (!resForm.date) e.date = 'Date required';
    if (!resForm.time) e.time = 'Time required';
    if (!resForm.phone.trim()) e.phone = 'Phone required';
    if (!resForm.email.trim()) e.email = 'Email required';
    return e;
  };

 const handleResSubmit = async (e) => {

  e.preventDefault();

  const validationErrors = validateRes();

  setResErrors(validationErrors);

  if (Object.keys(validationErrors).length > 0) {
    return;
  }

  setLoading(true);

  try {

   const response = await axios.post(
  `${import.meta.env.VITE_API_URL}/api/book-accommodation`,
  {
    fullName: values.fullName,
    accommodationType: values.accommodationType,
    checkInDate: values.checkIn,
    checkOutDate: values.checkOut,
    adults: values.adults,
    children: values.children,
    phone: values.phone,
    email: values.email,
  },
);

    console.log(response.data);

    setResSubmitted(true);

  } catch (error) {

    console.log(error);

    alert("Failed to send reservation");

  } finally {

    setLoading(false);
  }
};
  return (
    <section id="restaurant" className="restaurant section-pad">
      <div className="container">
        <div className="section-header center">
          <span className="section-label">Dining Experience</span>
          <h2 className="section-title">Restaurant & Bar</h2>
          <div className="divider-gold center" />
          <p className="section-subtitle">
            From sunrise breakfasts to candlelit dinners — our culinary team crafts every dish with seasonal ingredients and artful presentation.
          </p>
        </div>

        {/* Dining Spaces */}
        <div className="restaurant__spaces">
          <div className="restaurant__space">
            <div className="restaurant__space-img-wrap">
              <img src="https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=800&q=80" alt="Indoor Dining" loading="lazy" />
            </div>
            <div className="restaurant__space-body">
              <HomeIcon size={22} className="restaurant__space-icon" />
              <h3>The Garden Room</h3>
              <p>Intimate indoor dining with floor-to-ceiling glass walls overlooking the gardens. Climate-controlled comfort with an elegant, warm ambiance — perfect for private dinners and celebrations.</p>
              <div className="restaurant__space-details">
                <span>🕐 Lunch: 12:00–15:00</span>
                <span>🌙 Dinner: 18:00–23:00</span>
                <span>👥 Capacity: 80</span>
              </div>
            </div>
          </div>

          <div className="restaurant__space restaurant__space--reverse">
            <div className="restaurant__space-img-wrap">
              <img src="https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80" alt="Outdoor Bar" loading="lazy" />
            </div>
            <div className="restaurant__space-body">
              <Sun size={22} className="restaurant__space-icon" />
              <h3>The Terrace & Garden Bar</h3>
              <p>Open-air terrace dining surrounded by manicured gardens and soft ambient lighting. Our garden bar serves handcrafted cocktails, local craft beers, and a curated wine selection at sunset.</p>
              <div className="restaurant__space-details">
                <span>☀️ All day: 10:00–24:00</span>
                <span>🍹 Happy Hour: 17:00–19:00</span>
                <span>👥 Capacity: 150</span>
              </div>
            </div>
          </div>
        </div>

        {/* Menu */}
        <div className="restaurant__menu">
          <div className="section-header center">
            <span className="section-label">Our Menu</span>
            <h3 className="section-title" style={{ fontSize: '2rem' }}>Culinary Highlights</h3>
            <div className="divider-gold center" />
          </div>

          <div className="menu__tabs">
            {tabs.map(([key, cat]) => (
              <button
                key={key}
                className={`menu__tab ${activeTab === key ? 'menu__tab--active' : ''}`}
                onClick={() => setActiveTab(key)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          <div className="menu__grid">
            {MENU_CATEGORIES[activeTab].items.map((item, i) => (
              <div key={i} className="menu__item">
                <div className="menu__item-body">
                  <div className="menu__item-name">{item.name}</div>
                  <div className="menu__item-desc">{item.desc}</div>
                </div>
                <div className="menu__item-price">${item.price}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Reservation Form */}
        {/* Reservation Form */}
<div className="restaurant__reservation">
  <div className="restaurant__res-left">
    <img
      src={tableImg}
      alt="Table reservation"
      loading="lazy"
      className="restaurant__res-img"
    />
  </div>

  <div className="restaurant__res-right">
    <span className="section-label">Reserve a Table</span>
    <h3 className="restaurant__res-title">Dine with Us</h3>
    <div className="divider-gold" />

            {resSubmitted ? (
              <div className="restaurant__res-success">
                <div className="accom__success-icon">✓</div>
                <h4>Reservation Confirmed!</h4>
                <p>We look forward to welcoming you, <strong>{resForm.name}</strong>. A confirmation will be sent to {resForm.email}.</p>
                <button className="btn btn-outline-gold" onClick={() => setResSubmitted(false)}>New Reservation</button>
              </div>
            ) : (
              <form className="restaurant__res-form" onSubmit={handleResSubmit} noValidate>
                <div className="form-group">
                  <label className="form-label">Your Name *</label>
                  <input className={`form-input ${resErrors.name ? 'error' : ''}`} placeholder="Full name" value={resForm.name} onChange={e => setField('name', e.target.value)} />
                  {resErrors.name && <span className="form-error">{resErrors.name}</span>}
                </div>
                <div className="restaurant__res-row">
                  <div className="form-group">
                    <label className="form-label">Date *</label>
                    <input type="date" className={`form-input ${resErrors.date ? 'error' : ''}`} min={today} value={resForm.date} onChange={e => setField('date', e.target.value)} />
                    {resErrors.date && <span className="form-error">{resErrors.date}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Time *</label>
                    <select className={`form-select ${resErrors.time ? 'error' : ''}`} value={resForm.time} onChange={e => setField('time', e.target.value)}>
                      <option value="">Select time</option>
                      {['12:00','12:30','13:00','13:30','14:00','18:00','18:30','19:00','19:30','20:00','20:30','21:00'].map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                    {resErrors.time && <span className="form-error">{resErrors.time}</span>}
                  </div>
                </div>
                <div className="restaurant__res-row">
                  <div className="form-group">
                    <label className="form-label">Guests</label>
                    <select className="form-select" value={resForm.guests} onChange={e => setField('guests', e.target.value)}>
                      {[1,2,3,4,5,6,7,8].map(n => <option key={n} value={n}>{n} {n === 1 ? 'Guest' : 'Guests'}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Occasion</label>
                    <select className="form-select" value={resForm.occasion} onChange={e => setField('occasion', e.target.value)}>
                      <option value="">None</option>
                      {['Birthday','Anniversary','Romantic dinner','Business lunch','Celebration'].map(o => <option key={o} value={o}>{o}</option>)}
                    </select>
                  </div>
                </div>
                <div className="restaurant__res-row">
                  <div className="form-group">
                    <label className="form-label">Phone *</label>
                    <input type="tel" className={`form-input ${resErrors.phone ? 'error' : ''}`} placeholder="Phone number" value={resForm.phone} onChange={e => setField('phone', e.target.value)} />
                    {resErrors.phone && <span className="form-error">{resErrors.phone}</span>}
                  </div>
                  <div className="form-group">
                    <label className="form-label">Email *</label>
                    <input type="email" className={`form-input ${resErrors.email ? 'error' : ''}`} placeholder="Email address" value={resForm.email} onChange={e => setField('email', e.target.value)} />
                    {resErrors.email && <span className="form-error">{resErrors.email}</span>}
                  </div>
                </div>
                <button type="submit" className="btn btn-gold restaurant__res-submit">
                  <Send size={16} />
                  Reserve Table</button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
