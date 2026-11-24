// Central environment configuration for AdvaBliss Resort API.
// Uses canonical variable names with backward-compatible fallbacks.

const recipientRaw = process.env.MAIL_TO || process.env.RESORT_EMAIL || "";
const senderRaw = process.env.MAIL_FROM || process.env.RESEND_FROM_EMAIL || "onboarding@resend.dev";
const restaurantTemplateRaw = process.env.RESEND_RESTAURANT_TEMPLATE_ID || process.env.RESEND_TABLE_TEMPLATE_ID || "";

// Deprecation warnings for legacy aliases
if (process.env.RESORT_EMAIL && !process.env.MAIL_TO) {
  console.warn("[config] Deprecated alias RESORT_EMAIL used. Please use canonical MAIL_TO.");
}
if (process.env.RESEND_FROM_EMAIL && !process.env.MAIL_FROM) {
  console.warn("[config] Deprecated alias RESEND_FROM_EMAIL used. Please use canonical MAIL_FROM.");
}
if (process.env.RESEND_TABLE_TEMPLATE_ID && !process.env.RESEND_RESTAURANT_TEMPLATE_ID) {
  console.warn("[config] Deprecated alias RESEND_TABLE_TEMPLATE_ID used. Please use canonical RESEND_RESTAURANT_TEMPLATE_ID.");
}

const templateIds = {
  contact: process.env.RESEND_CONTACT_TEMPLATE_ID || "",
  accommodation: process.env.RESEND_ACCOMMODATION_TEMPLATE_ID || "",
  restaurant: restaurantTemplateRaw,
  meeting: process.env.RESEND_MEETING_TEMPLATE_ID || "",
};

// Canonical allowed origins
const defaultAllowedOrigins = [
  "https://advabliss-resort-ruiru.vercel.app",
  "https://advabliss.com",
  "https://www.advabliss.com",
  "http://localhost:5173",
  "http://localhost:3000",
  "http://localhost:5000",
];

const envOrigins = (process.env.CORS_ORIGINS || "")
  .split(",")
  .map((s) => s.trim().replace(/\/+$/, ""))
  .filter(Boolean);

const corsOrigins = Array.from(new Set([...envOrigins, ...defaultAllowedOrigins]));

const isProduction = process.env.NODE_ENV === "production";
const resendApiKey = process.env.RESEND_API_KEY || "";

// Startup validation
const missing = [];
if (!resendApiKey) missing.push("RESEND_API_KEY");
if (!recipientRaw) missing.push("MAIL_TO (or RESORT_EMAIL)");
if (!templateIds.contact) missing.push("RESEND_CONTACT_TEMPLATE_ID");
if (!templateIds.accommodation) missing.push("RESEND_ACCOMMODATION_TEMPLATE_ID");
if (!templateIds.restaurant) missing.push("RESEND_RESTAURANT_TEMPLATE_ID");

module.exports = {
  isProduction,
  isTest: process.env.NODE_ENV === "test",
  port: parseInt(process.env.PORT || "5000", 10),
  resendApiKey,
  // Canonical sender
  mailFrom: senderRaw.trim(),
  // Admin inbox(es) that receive bookings and enquiries
  mailTo: recipientRaw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  templateIds,
  corsOrigins,
  missing,
};
