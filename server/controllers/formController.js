const { Resend } = require("resend");
const config = require("../config/env");
const escapeHtml = require("../utils/escapeHtml");

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

const e = escapeHtml;

// Sends through Resend and surfaces provider errors (the SDK returns { error } rather than throwing)
async function sendMail({ subject, html, replyTo }) {
  if (!resend || config.mailTo.length === 0) {
    const err = new Error("Email service is not configured (RESEND_API_KEY / MAIL_TO)");
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }
  const { data, error } = await resend.emails.send({
    from: config.mailFrom,
    to: config.mailTo,
    subject,
    html,
    ...(replyTo ? { replyTo } : {}),
  });
  if (error) {
    const err = new Error(error.message || "Email provider rejected the request");
    err.code = "EMAIL_PROVIDER_ERROR";
    err.provider = error;
    throw err;
  }
  return data;
}

function fail(res, error, userMessage) {
  console.error(`[email] ${error.code || "ERROR"}:`, error.message);
  const status = error.code === "EMAIL_NOT_CONFIGURED" ? 503 : 502;
  return res.status(status).json({ success: false, message: userMessage });
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

// Pricing (KSh) for optional event enhancements — keep in sync with frontend/src/data/siteData.js
const EVENT_ADDON_PRICES = {
  tent: { name: "Marquee Tent", price: 400 },
  decor: { name: "Floral Decorations", price: 250 },
  sound: { name: "Sound System", price: 300 },
  dj: { name: "Professional DJ", price: 500 },
  lighting: { name: "Ambient Lighting", price: 350 },
  catering: { name: "Full Catering", price: 1200 },
};

const EVENT_CAPACITY = {
  Weddings: [20, 500],
  "Corporate Events": [10, 300],
  "Private Parties": [10, 200],
  "Garden Hire": [50, 1000],
};

const formatKSh = (n) => `KSh ${Number(n).toLocaleString("en-KE")}`;

const row = (label, value) => `<p><strong>${label}:</strong> ${e(value)}</p>`;

const bad = (res, message) => res.status(400).json({ success: false, message });

exports.contactForm = async (req, res) => {
  const { name, phone, email, message } = req.body || {};
  if (!name || !message) return bad(res, "Name and message are required");
  if (email && !EMAIL_RE.test(email)) return bad(res, "A valid email address is required");

  try {
    await sendMail({
      subject: "New Contact Message",
      replyTo: email || undefined,
      html: `<h2>New Contact Message</h2>${row("Name", name)}${row("Phone", phone)}${row("Email", email)}${row("Message", message)}`,
    });
    res.json({ success: true, message: "Message sent successfully" });
  } catch (error) {
    fail(res, error, "Failed to send message");
  }
};

exports.accommodationForm = async (req, res) => {
  const { fullName, accommodationType, checkInDate, checkOutDate, adults, children, phone, email } = req.body || {};
  if (!fullName || !checkInDate || !checkOutDate) return bad(res, "Name and stay dates are required");
  if (!EMAIL_RE.test(email || "")) return bad(res, "A valid email address is required");

  try {
    await sendMail({
      subject: "New Accommodation Booking",
      replyTo: email,
      html: `<h2>Accommodation Reservation</h2>${row("Guest Name", fullName)}${row("Accommodation Type", accommodationType)}${row("Check-In Date", checkInDate)}${row("Check-Out Date", checkOutDate)}${row("Adults", adults)}${row("Children", children)}${row("Phone", phone)}${row("Email", email)}`,
    });
    res.json({ success: true, message: "Reservation request sent successfully" });
  } catch (error) {
    fail(res, error, "Failed to send reservation");
  }
};

exports.restaurantForm = async (req, res) => {
  const { fullName, date, time, guests, occasion, phone, email, requests } = req.body || {};
  if (!fullName || !date || !time) return bad(res, "Name, date and time are required");
  if (!EMAIL_RE.test(email || "")) return bad(res, "A valid email address is required");

  try {
    await sendMail({
      subject: "New Restaurant Reservation",
      replyTo: email,
      html: `<h2>Restaurant Reservation</h2>${row("Name", fullName)}${row("Date", date)}${row("Time", time)}${row("Guests", guests)}${row("Occasion / Space", occasion)}${row("Phone", phone)}${row("Email", email)}${row("Special Requests", requests || "None")}`,
    });
    res.json({ success: true, message: "Restaurant reservation sent successfully" });
  } catch (error) {
    fail(res, error, "Failed to send reservation");
  }
};

exports.meetingForm = async (req, res) => {
  const { eventType, fullName, name, email, phone, eventDate, date, guests, details, message, addonIds } = req.body || {};

  const resolvedName = fullName || name || "";
  const resolvedDate = eventDate || date || "";
  const resolvedDetails = details || message || "None";

  if (!resolvedName.trim()) return bad(res, "Name is required");
  if (!EMAIL_RE.test(email || "")) return bad(res, "A valid email address is required");
  if (!phone || !String(phone).trim()) return bad(res, "Phone number is required");
  if (!resolvedDate) return bad(res, "Event date is required");

  const capacity = EVENT_CAPACITY[eventType];
  if (!capacity) return bad(res, "Unknown event category");
  const guestCount = Number(guests);
  if (!Number.isInteger(guestCount) || guestCount < capacity[0] || guestCount > capacity[1]) {
    return bad(res, `${eventType} accommodate ${capacity[0]}–${capacity[1]} guests`);
  }

  // Price is always recomputed on the server; the client total is never trusted
  const ids = Array.isArray(addonIds) ? [...new Set(addonIds)] : [];
  if (ids.some((id) => !EVENT_ADDON_PRICES[id])) return bad(res, "Unknown enhancement selected");
  const selected = ids.map((id) => EVENT_ADDON_PRICES[id]);
  const total = selected.reduce((sum, a) => sum + a.price, 0);
  const addonsHtml = selected.length
    ? `<ul>${selected.map((a) => `<li>${e(a.name)} — ${formatKSh(a.price)}</li>`).join("")}</ul>`
    : "None";

  try {
    await sendMail({
      subject: "New Event Enquiry",
      replyTo: email,
      html: `<h2>Event Enquiry</h2>${row("Event Type", eventType)}${row("Name", resolvedName)}${row("Email", email)}${row("Phone", phone)}${row("Event Date", resolvedDate)}${row("Guests", guestCount)}<p><strong>Selected Enhancements:</strong></p>${addonsHtml}${row("Enhancements Total", formatKSh(total))}${row("Details", resolvedDetails)}`,
    });
    res.json({ success: true, message: "Event enquiry sent successfully", estimatedTotal: total });
  } catch (error) {
    fail(res, error, "Failed to send enquiry");
  }
};

exports.subscribe = async (req, res) => {
  const { email } = req.body || {};
  if (!EMAIL_RE.test(email || "")) return bad(res, "A valid email address is required");

  try {
    await sendMail({
      subject: "New Subscriber",
      html: `<h2>New Subscription</h2>${row("Email", email)}`,
    });
    res.status(200).json({ success: true, message: "Subscribed successfully" });
  } catch (error) {
    fail(res, error, "Something went wrong");
  }
};
