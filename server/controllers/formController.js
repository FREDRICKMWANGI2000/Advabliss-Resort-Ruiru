const { Resend } = require("resend");
const config = require("../config/env");
const { resolveAccommodation, EVENT_CAPACITY, EVENT_ADDON_PRICES } = require("../data/accommodations");
const {
  isValidEmail,
  sanitizeHeader,
  sanitizeText,
  isValidDate,
  isValidPhone,
  generateRequestId,
} = require("../utils/validators");
const {
  formatKSh,
  buildContactGuestEmail,
  buildAccommodationGuestEmail,
  buildRestaurantGuestEmail,
  buildMeetingGuestEmail,
  buildContactAdminEmail,
  buildAccommodationAdminEmail,
  buildRestaurantAdminEmail,
  buildMeetingAdminEmail,
} = require("../utils/emailTemplates");

let resendInstance = config.resendApiKey ? new Resend(config.resendApiKey) : null;

// Helper to allow mocking Resend in automated tests
function setResendClient(client) {
  resendInstance = client;
}

function getResendClient() {
  return resendInstance;
}

/**
 * Sends the Admin Notification to MAIL_TO.
 * Uses Resend template if configured; falls back cleanly to branded HTML.
 */
async function sendAdminNotification({ templateName, subject, variables, replyTo, fallbackEmailBuilder }) {
  const client = getResendClient();
  if (!client || config.mailTo.length === 0) {
    const err = new Error("Email service is not configured (RESEND_API_KEY / MAIL_TO)");
    err.code = "EMAIL_NOT_CONFIGURED";
    throw err;
  }

  const templateId = config.templateIds[templateName];
  const cleanSubject = sanitizeHeader(subject);

  // If a template ID is configured, send using Resend template
  if (templateId) {
    const payload = {
      from: config.mailFrom,
      to: config.mailTo,
      subject: cleanSubject,
      template: { id: templateId, variables },
      ...(replyTo ? { replyTo: sanitizeHeader(replyTo) } : {}),
    };

    const { data, error } = await client.emails.send(payload);
    if (error) {
      console.warn(`[email] Resend template (${templateName} / ${templateId}) send failed: ${error.message}. Attempting branded HTML fallback.`);
      // If template fails, fall back to branded HTML email so message is not lost
      if (typeof fallbackEmailBuilder === "function") {
        const fallback = fallbackEmailBuilder();
        const fallbackResult = await client.emails.send({
          from: config.mailFrom,
          to: config.mailTo,
          subject: fallback.subject,
          html: fallback.html,
          text: fallback.text,
          ...(replyTo ? { replyTo: sanitizeHeader(replyTo) } : {}),
        });
        if (fallbackResult.error) {
          const err = new Error(fallbackResult.error.message || "Email provider rejected request");
          err.code = "EMAIL_PROVIDER_ERROR";
          err.provider = fallbackResult.error;
          throw err;
        }
        return fallbackResult.data;
      }
      const err = new Error(error.message || "Email provider rejected request");
      err.code = "EMAIL_PROVIDER_ERROR";
      err.provider = error;
      throw err;
    }
    return data;
  }

  // Fallback when template is not configured: Send high-quality branded HTML email
  if (typeof fallbackEmailBuilder === "function") {
    const fallback = fallbackEmailBuilder();
    const { data, error } = await client.emails.send({
      from: config.mailFrom,
      to: config.mailTo,
      subject: fallback.subject,
      html: fallback.html,
      text: fallback.text,
      ...(replyTo ? { replyTo: sanitizeHeader(replyTo) } : {}),
    });
    if (error) {
      const err = new Error(error.message || "Email provider rejected request");
      err.code = "EMAIL_PROVIDER_ERROR";
      err.provider = error;
      throw err;
    }
    return data;
  }

  const err = new Error(`Email template is not configured (RESEND_${templateName.toUpperCase()}_TEMPLATE_ID)`);
  err.code = "EMAIL_TEMPLATE_NOT_CONFIGURED";
  throw err;
}

/**
 * Sends the Guest Acknowledgement to the guest's email.
 * Failures here NEVER fail the overall request if admin notification succeeded.
 */
async function sendGuestAcknowledgement(guestEmail, emailData) {
  const client = getResendClient();
  if (!client || !isValidEmail(guestEmail)) {
    return false;
  }

  // Check if sender is unverified test sender (e.g. onboarding@resend.dev)
  const isTestSender = config.mailFrom.toLowerCase().includes("resend.dev");
  const isSendingToAdmin = config.mailTo.some((to) => to.toLowerCase() === guestEmail.toLowerCase());

  // In Resend, onboarding@resend.dev can only deliver to the account holder's email
  if (isTestSender && !isSendingToAdmin) {
    console.warn(`[email] Skipping guest acknowledgement to ${guestEmail}: MAIL_FROM (${config.mailFrom}) is in Resend test mode. A verified custom domain is required for arbitrary guest delivery.`);
    return false;
  }

  try {
    const { data, error } = await client.emails.send({
      from: config.mailFrom,
      to: sanitizeHeader(guestEmail),
      subject: sanitizeHeader(emailData.subject),
      html: emailData.html,
      text: emailData.text,
    });

    if (error) {
      console.warn(`[email] Guest acknowledgement delivery failed for ${guestEmail}:`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn(`[email] Guest acknowledgement error for ${guestEmail}:`, err.message);
    return false;
  }
}

function fail(res, error, userMessage) {
  console.error(`[email] ${error.code || "ERROR"}:`, error.message);
  const status = ["EMAIL_NOT_CONFIGURED", "EMAIL_TEMPLATE_NOT_CONFIGURED"].includes(error.code) ? 503 : 502;
  return res.status(status).json({ success: false, message: userMessage });
}

const bad = (res, message) => res.status(400).json({ success: false, message });

// -------------------------------------------------------------
// POST /api/contact
// -------------------------------------------------------------
exports.contactForm = async (req, res) => {
  const body = req.body || {};
  const name = sanitizeText(body.name, 100);
  const email = sanitizeHeader(body.email);
  const phone = sanitizeText(body.phone, 30);
  const message = sanitizeText(body.message, 2000);

  if (!name || name.length < 2) return bad(res, "Please provide your full name (minimum 2 characters).");
  if (!message || message.length < 5) return bad(res, "Please provide a message (minimum 5 characters).");
  if (email && !isValidEmail(email)) return bad(res, "Please enter a valid email address.");
  if (phone && !isValidPhone(phone)) return bad(res, "Please enter a valid phone number.");

  const requestId = generateRequestId("CON");

  try {
    await sendAdminNotification({
      templateName: "contact",
      subject: `New website enquiry from ${name} [${requestId}]`,
      variables: {
        REQUEST_ID: requestId,
        NAME: name,
        PHONE: phone || "Not provided",
        EMAIL: email || "Not provided",
        MESSAGE: message,
      },
      replyTo: email || undefined,
      fallbackEmailBuilder: () => buildContactAdminEmail({ name, email, phone, message, requestId }),
    });

    // Send guest acknowledgement if email was provided
    let guestEmailDelivered = false;
    if (email) {
      const guestEmailData = buildContactGuestEmail({ name, email, phone, message, requestId });
      guestEmailDelivered = await sendGuestAcknowledgement(email, guestEmailData);
    }

    res.json({
      success: true,
      message: "Your enquiry has been received successfully.",
      requestId,
      emailStatus: {
        admin: true,
        guest: guestEmailDelivered,
      },
    });
  } catch (error) {
    fail(res, error, "Failed to send message. Please contact reception directly.");
  }
};

// -------------------------------------------------------------
// POST /api/book-accommodation
// -------------------------------------------------------------
exports.accommodationForm = async (req, res) => {
  const body = req.body || {};
  const fullName = sanitizeText(body.fullName, 100);
  const accommodationType = sanitizeText(body.accommodationType, 50);
  const checkInDate = sanitizeHeader(body.checkInDate);
  const checkOutDate = sanitizeHeader(body.checkOutDate);
  const phone = sanitizeText(body.phone, 30);
  const email = sanitizeHeader(body.email);
  const specialRequests = sanitizeText(body.specialRequests || body.requests, 1000);

  const adults = Number.isInteger(Number(body.adults)) ? Math.max(1, Math.min(20, Number(body.adults))) : 2;
  const children = Number.isInteger(Number(body.children)) ? Math.max(0, Math.min(20, Number(body.children))) : 0;

  if (!fullName || fullName.length < 2) return bad(res, "Guest full name is required.");
  if (!isValidEmail(email)) return bad(res, "A valid email address is required for confirmation.");
  if (!isValidPhone(phone)) return bad(res, "A valid phone number is required for booking contact.");
  if (!isValidDate(checkInDate)) return bad(res, "Check-in date must be a valid date (YYYY-MM-DD).");
  if (!isValidDate(checkOutDate)) return bad(res, "Check-out date must be a valid date (YYYY-MM-DD).");

  if (checkOutDate <= checkInDate) {
    return bad(res, "Check-out date must be after check-in date.");
  }

  // Prevent dates in the past
  const todayStr = new Date().toISOString().split("T")[0];
  if (checkInDate < todayStr) {
    return bad(res, "Check-in date cannot be in the past.");
  }

  // Calculate nights
  const checkInTime = new Date(checkInDate).getTime();
  const checkOutTime = new Date(checkOutDate).getTime();
  const nights = Math.max(1, Math.round((checkOutTime - checkInTime) / (1000 * 60 * 60 * 24)));

  // Authoritative room resolution
  const room = resolveAccommodation(accommodationType);
  const estimatedTotal = room.price ? nights * room.price : null;
  const requestId = generateRequestId("ACC");

  try {
    await sendAdminNotification({
      templateName: "accommodation",
      subject: `New accommodation reservation request — ${room.name} [${requestId}]`,
      variables: {
        REQUEST_ID: requestId,
        FULL_NAME: fullName,
        ROOM_TYPE: room.name,
        ROOM_SLUG: room.id,
        CHECK_IN: checkInDate,
        CHECK_OUT: checkOutDate,
        NIGHTS: String(nights),
        ADULTS: String(adults),
        CHILDREN: String(children),
        ESTIMATED_TOTAL: estimatedTotal ? formatKSh(estimatedTotal) : "On enquiry",
        PHONE: phone,
        EMAIL: email,
        SPECIAL_REQUESTS: specialRequests || "None",
      },
      replyTo: email,
      fallbackEmailBuilder: () =>
        buildAccommodationAdminEmail({
          fullName,
          email,
          phone,
          roomName: room.name,
          checkInDate,
          checkOutDate,
          nights,
          adults,
          children,
          estimatedTotal,
          specialRequests,
          requestId,
        }),
    });

    // Send guest acknowledgement
    const guestEmailData = buildAccommodationGuestEmail({
      fullName,
      email,
      phone,
      roomName: room.name,
      checkInDate,
      checkOutDate,
      nights,
      adults,
      children,
      estimatedTotal,
      specialRequests,
      requestId,
    });
    const guestEmailDelivered = await sendGuestAcknowledgement(email, guestEmailData);

    res.json({
      success: true,
      message: "Your accommodation request has been received.",
      requestId,
      reservation: {
        fullName,
        roomType: room.name,
        accommodationType: room.id,
        checkInDate,
        checkOutDate,
        nights,
        adults,
        children,
        estimatedTotal,
        specialRequests: specialRequests || "",
      },
      emailStatus: {
        admin: true,
        guest: guestEmailDelivered,
      },
    });
  } catch (error) {
    fail(res, error, "Failed to send reservation request. Please contact reception directly.");
  }
};

// -------------------------------------------------------------
// POST /api/book-restaurant
// -------------------------------------------------------------
exports.restaurantForm = async (req, res) => {
  const body = req.body || {};
  const fullName = sanitizeText(body.fullName || body.name, 100);
  const date = sanitizeHeader(body.date);
  const time = sanitizeHeader(body.time);
  const phone = sanitizeText(body.phone, 30);
  const email = sanitizeHeader(body.email);
  const specialRequests = sanitizeText(body.specialRequests || body.requests, 1000);

  // Parse seating area and occasion separately
  let seatingArea = sanitizeText(body.seatingArea, 100);
  let occasion = sanitizeText(body.occasion, 100);

  // If a legacy combined string was sent under occasion (e.g. "Lakeside Terrace · Anniversary")
  if (!seatingArea && occasion && occasion.includes(" · ")) {
    const parts = occasion.split(" · ");
    seatingArea = parts[0].trim();
    occasion = parts[1].trim();
  } else if (!seatingArea) {
    seatingArea = "The Garden Room & Gazebos";
  }

  // Parse guests
  let guestCountNum = 2;
  let guestsText = "2 Guests";
  if (body.guests) {
    const matched = String(body.guests).match(/\d+/);
    if (matched) {
      guestCountNum = Math.max(1, Math.min(100, parseInt(matched[0], 10)));
      guestsText = `${guestCountNum} ${guestCountNum === 1 ? "Guest" : "Guests"}`;
    }
  }

  if (!fullName || fullName.length < 2) return bad(res, "Guest full name is required.");
  if (!isValidEmail(email)) return bad(res, "A valid email address is required for confirmation.");
  if (!isValidPhone(phone)) return bad(res, "A valid phone number is required for table reservation.");
  if (!isValidDate(date)) return bad(res, "Reservation date must be a valid date (YYYY-MM-DD).");
  if (!time) return bad(res, "Preferred reservation time is required.");

  const todayStr = new Date().toISOString().split("T")[0];
  if (date < todayStr) {
    return bad(res, "Reservation date cannot be in the past.");
  }

  const requestId = generateRequestId("RES");

  try {
    await sendAdminNotification({
      templateName: "restaurant",
      subject: `New restaurant reservation request — ${fullName} (${guestsText}) [${requestId}]`,
      variables: {
        REQUEST_ID: requestId,
        FULL_NAME: fullName,
        DATE: date,
        TIME: time,
        GUESTS: guestsText,
        SEATING_AREA: seatingArea,
        OCCASION: occasion || "None",
        PHONE: phone,
        EMAIL: email,
        SPECIAL_REQUESTS: specialRequests || "None",
      },
      replyTo: email,
      fallbackEmailBuilder: () =>
        buildRestaurantAdminEmail({
          fullName,
          email,
          phone,
          date,
          time,
          guests: guestsText,
          seatingArea,
          occasion: occasion || "None",
          specialRequests,
          requestId,
        }),
    });

    // Send guest acknowledgement
    const guestEmailData = buildRestaurantGuestEmail({
      fullName,
      email,
      phone,
      date,
      time,
      guests: guestsText,
      seatingArea,
      occasion: occasion || "None",
      specialRequests,
      requestId,
    });
    const guestEmailDelivered = await sendGuestAcknowledgement(email, guestEmailData);

    res.json({
      success: true,
      message: "Your restaurant reservation request has been received.",
      requestId,
      reservation: {
        fullName,
        date,
        time,
        guests: guestsText,
        seatingArea,
        occasion: occasion || "None",
        specialRequests: specialRequests || "",
      },
      emailStatus: {
        admin: true,
        guest: guestEmailDelivered,
      },
    });
  } catch (error) {
    fail(res, error, "Failed to send table reservation. Please contact concierge directly.");
  }
};

// -------------------------------------------------------------
// POST /api/book-meeting (Restored Meetings & Events Enquiry)
// -------------------------------------------------------------
exports.meetingForm = async (req, res) => {
  const body = req.body || {};
  const eventType = sanitizeText(body.eventType || "Weddings", 50);
  const fullName = sanitizeText(body.fullName || body.name, 100);
  const email = sanitizeHeader(body.email);
  const phone = sanitizeText(body.phone, 30);
  const eventDate = sanitizeHeader(body.eventDate || body.date);
  const details = sanitizeText(body.details || body.message, 2000);
  const addonIds = Array.isArray(body.addonIds) ? [...new Set(body.addonIds)] : [];

  if (!fullName || fullName.length < 2) return bad(res, "Contact name is required.");
  if (!isValidEmail(email)) return bad(res, "A valid email address is required.");
  if (!isValidPhone(phone)) return bad(res, "A valid phone number is required.");
  if (!isValidDate(eventDate)) return bad(res, "Event date must be a valid date (YYYY-MM-DD).");

  const todayStr = new Date().toISOString().split("T")[0];
  if (eventDate < todayStr) {
    return bad(res, "Event date cannot be in the past.");
  }

  // Validate guest capacity
  const capacity = EVENT_CAPACITY[eventType] || [10, 1000];
  const guestCount = parseInt(body.guests, 10);
  if (!Number.isInteger(guestCount) || guestCount < 1 || guestCount > 2000) {
    return bad(res, "Please provide an expected guest count.");
  }

  // Authoritative addon calculation
  const validAddons = [];
  let addonsTotal = 0;
  for (const id of addonIds) {
    if (EVENT_ADDON_PRICES[id]) {
      validAddons.push(EVENT_ADDON_PRICES[id]);
      addonsTotal += EVENT_ADDON_PRICES[id].price;
    }
  }

  const requestId = generateRequestId("EVT");

  try {
    await sendAdminNotification({
      templateName: "meeting",
      subject: `New Event Enquiry — ${fullName} (${eventType}) [${requestId}]`,
      variables: {
        REQUEST_ID: requestId,
        EVENT_TYPE: eventType,
        FULL_NAME: fullName,
        EMAIL: email,
        PHONE: phone,
        EVENT_DATE: eventDate,
        GUESTS: String(guestCount),
        ENHANCEMENTS_TOTAL: formatKSh(addonsTotal),
        DETAILS: details || "None",
      },
      replyTo: email,
      fallbackEmailBuilder: () =>
        buildMeetingAdminEmail({
          fullName,
          email,
          phone,
          eventType,
          eventDate,
          guests: guestCount,
          addons: validAddons,
          estimatedTotal: addonsTotal,
          details,
          requestId,
        }),
    });

    const guestEmailData = buildMeetingGuestEmail({
      fullName,
      email,
      phone,
      eventType,
      eventDate,
      guests: guestCount,
      addons: validAddons,
      estimatedTotal: addonsTotal,
      details,
      requestId,
    });
    const guestEmailDelivered = await sendGuestAcknowledgement(email, guestEmailData);

    res.json({
      success: true,
      message: "Your event enquiry has been received successfully.",
      requestId,
      event: {
        eventType,
        fullName,
        eventDate,
        guests: guestCount,
        addons: validAddons,
        estimatedTotal: addonsTotal,
        details: details || "",
      },
      emailStatus: {
        admin: true,
        guest: guestEmailDelivered,
      },
    });
  } catch (error) {
    fail(res, error, "Failed to submit event enquiry. Please call our events team directly.");
  }
};

module.exports = {
  contactForm: exports.contactForm,
  accommodationForm: exports.accommodationForm,
  restaurantForm: exports.restaurantForm,
  meetingForm: exports.meetingForm,
  setResendClient,
};
