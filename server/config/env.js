// Central environment configuration. No secrets or URLs are hardcoded here.
const required = ["RESEND_API_KEY", "MAIL_TO"];

const missing = required.filter((k) => !process.env[k]);

module.exports = {
  isProduction: process.env.NODE_ENV === "production",
  port: process.env.PORT || 5000,
  resendApiKey: process.env.RESEND_API_KEY,
  // Sender must be a verified Resend domain in production
  mailFrom: process.env.MAIL_FROM || "onboarding@resend.dev",
  // Inbox that receives enquiries (comma separated list allowed)
  mailTo: (process.env.MAIL_TO || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean),
  // Comma separated list of allowed frontend origins
  corsOrigins: (process.env.CORS_ORIGINS || "")
    .split(",")
    .map((s) => s.trim().replace(/\/$/, ""))
    .filter(Boolean),
  missing,
};
