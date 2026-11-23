const { Resend } = require("resend");
const config = require("../config/env");

const resend = config.resendApiKey ? new Resend(config.resendApiKey) : null;

// Sends through Resend and surfaces provider errors (the SDK returns { error } rather than throwing)
async function sendMail({ templateName, variables, replyTo }) {
  if (!resend || config.mailTo.length === 0) {
    const err = new Error("Email service is not configured (RESEND_API_KEY / RESORT_EMAIL or MAIL_TO)");
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }
  const templateId = config.templateIds[templateName];
  if (!templateId) {
    const err = new Error(`Email template is not configured (RESEND_${templateName.toUpperCase()}_TEMPLATE_ID)`);
    err.code = "EMAIL_TEMPLATE_NOT_CONFIGURED";
    throw err;
  }
  const { data, error } = await resend.emails.send({
    from: config.mailFrom,
    to: config.mailTo,
    template: { id: templateId, variables },
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
  const status = ["EMAIL_NOT_CONFIGURED", "EMAIL_TEMPLATE_NOT_CONFIGURED"].includes(error.code) ? 503 : 502;
  return res.status(status).json({ success: false, message: userMessage });
}

const EMAIL_RE = /^\S+@\S+\.\S+$/;

const bad = (res, message) => res.status(400).json({ success: false, message });

exports.contactForm = async (req, res) => {
  const { name, phone, email, message } = req.body || {};
  if (!name || !message) return bad(res, "Name and message are required");
  if (email && !EMAIL_RE.test(email)) return bad(res, "A valid email address is required");

  try {
    await sendMail({
      templateName: "contact",
      variables: { NAME: name, PHONE: phone || "Not provided", EMAIL: email || "Not provided", MESSAGE: message },
      replyTo: email || undefined,
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
      templateName: "accommodation",
      variables: {
        FULL_NAME: fullName,
        ROOM_TYPE: accommodationType || "Not specified",
        CHECK_IN: checkInDate,
        CHECK_OUT: checkOutDate,
        ADULTS: String(adults ?? "Not specified"),
        CHILDREN: String(children ?? "Not specified"),
        PHONE: phone || "Not provided",
        EMAIL: email,
      },
      replyTo: email,
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
      templateName: "restaurant",
      variables: {
        FULL_NAME: fullName,
        DATE: date,
        TIME: time,
        GUESTS: guests,
        OCCASION: occasion || "None",
        PHONE: phone || "Not provided",
        EMAIL: email,
        SPECIAL_REQUESTS: requests || "None",
      },
      replyTo: email,
    });
    res.json({ success: true, message: "Restaurant reservation sent successfully" });
  } catch (error) {
    fail(res, error, "Failed to send reservation");
  }
};

