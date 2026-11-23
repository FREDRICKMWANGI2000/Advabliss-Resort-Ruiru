// Central environment configuration. No secrets or URLs are hardcoded here.
// RESORT_EMAIL is preferred; MAIL_TO remains supported for existing setups.
const recipient = process.env.RESORT_EMAIL || process.env.MAIL_TO || "";

const templateIds = {
  contact: process.env.RESEND_CONTACT_TEMPLATE_ID,
  accommodation: process.env.RESEND_ACCOMMODATION_TEMPLATE_ID,
  restaurant: process.env.RESEND_RESTAURANT_TEMPLATE_ID,
};

const missing = [];
if (!process.env.RESEND_API_KEY) missing.push("RESEND_API_KEY");
if (!recipient) missing.push("RESORT_EMAIL (or MAIL_TO)");
if (!templateIds.contact) missing.push("RESEND_CONTACT_TEMPLATE_ID");
if (!templateIds.accommodation) missing.push("RESEND_ACCOMMODATION_TEMPLATE_ID");
if (!templateIds.restaurant) missing.push("RESEND_RESTAURANT_TEMPLATE_ID");

module.exports = {
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT || 5000,
  resendApiKey: process.env.RESEND_API_KEY,
  // Sender must be a verified Resend domain in production
  mailFrom: process.env.MAIL_FROM || "onboarding@resend.dev",
  // Inbox that receives enquiries (comma separated list allowed)
  mailTo: recipient
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  templateIds,
  // Comma separated list of allowed frontend origins
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean),
  missing,
};
