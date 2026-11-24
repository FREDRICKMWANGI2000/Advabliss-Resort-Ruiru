const crypto = require("crypto");

const EMAIL_RE = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;

function isValidEmail(email) {
  if (typeof email !== "string") return false;
  const trimmed = email.trim();
  if (trimmed.length < 5 || trimmed.length > 254) return false;
  if (/[\r\n\t]/.test(trimmed)) return false;
  return EMAIL_RE.test(trimmed);
}

function sanitizeHeader(str) {
  if (!str) return "";
  return String(str).replace(/[\r\n\x00-\x1F\x7F]+/g, " ").trim();
}

function sanitizeText(str, maxLength = 2000) {
  if (str === null || str === undefined) return "";
  const cleaned = String(str).replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, "").trim();
  return cleaned.length > maxLength ? cleaned.slice(0, maxLength) : cleaned;
}

function isValidDate(dateStr) {
  if (typeof dateStr !== "string") return false;
  const trimmed = dateStr.trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(trimmed)) return false;
  const [year, month, day] = trimmed.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return (
    d.getFullYear() === year &&
    d.getMonth() === month - 1 &&
    d.getDate() === day
  );
}

function isValidPhone(phone) {
  if (!phone) return false;
  const cleaned = String(phone).replace(/[\s\-.()+]/g, "");
  return cleaned.length >= 8 && cleaned.length <= 15 && /^\d+$/.test(cleaned);
}

function generateRequestId(prefix = "REQ") {
  const cleanPrefix = String(prefix).toUpperCase().replace(/[^A-Z0-9]/g, "").slice(0, 4) || "REQ";
  const hex = crypto.randomBytes(4).toString("hex").toUpperCase();
  return `ADV-${cleanPrefix}-${hex}`;
}

module.exports = {
  isValidEmail,
  sanitizeHeader,
  sanitizeText,
  isValidDate,
  isValidPhone,
  generateRequestId,
};
