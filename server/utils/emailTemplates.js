const escapeHtml = require("./escapeHtml");

const e = escapeHtml;

const BRAND = {
  name: "AdvaBliss Resort",
  sub: "Resort · Ruiru",
  tagline: "Where Serenity Meets Warmth",
  phone: "+254 748 935 428",
  phoneDisplay: "+254 748 935 428",
  email: "fredifytechnologies@gmail.com",
  location: "Ruiru, Kiambu County, Kenya",
  website: "https://advabliss.com",
};

function formatKSh(amount) {
  if (amount === null || amount === undefined || isNaN(amount)) return "—";
  return `KSh ${Number(amount).toLocaleString("en-KE")}`;
}

function emailWrapper({ title, preheader, contentHtml }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${e(title)}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #F9F6F0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2A2A2A; -webkit-font-smoothing: antialiased; }
    table { border-collapse: collapse; }
    img { border: 0; outline: none; text-decoration: none; display: block; }
    .email-container { max-width: 600px; margin: 0 auto; background: #FFFFFF; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.06); }
    .email-header { background: #1A2E1A; padding: 36px 32px 30px; text-align: center; border-bottom: 3px solid #D7A51D; }
    .brand-title { color: #FFFFFF; font-size: 24px; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; margin: 0; }
    .brand-title em { color: #D7A51D; font-style: normal; }
    .brand-sub { color: rgba(255,255,255,0.7); font-size: 11px; letter-spacing: 3px; text-transform: uppercase; margin-top: 6px; }
    .email-body { padding: 36px 32px; background: #FFFFFF; }
    .badge-ref { display: inline-block; background: #F9F6F0; border: 1px solid #D7A51D; color: #1A2E1A; font-size: 12px; font-weight: 700; letter-spacing: 1px; padding: 6px 14px; border-radius: 4px; margin-bottom: 20px; }
    .greeting { font-size: 18px; color: #1A2E1A; font-weight: 600; margin: 0 0 12px; }
    .lead-text { font-size: 15px; line-height: 1.6; color: #4A4A4A; margin: 0 0 24px; }
    .ledger-table { width: 100%; margin: 20px 0 24px; border: 1px solid #EFECE6; border-radius: 6px; overflow: hidden; background: #FAF8F5; }
    .ledger-table td { padding: 12px 16px; font-size: 14px; border-bottom: 1px solid #EFECE6; }
    .ledger-table tr:last-child td { border-bottom: none; }
    .ledger-label { color: #6E6E6E; font-weight: 500; width: 40%; }
    .ledger-value { color: #1A2E1A; font-weight: 600; }
    .callout-box { background: rgba(215, 165, 29, 0.08); border-left: 4px solid #D7A51D; padding: 16px 20px; border-radius: 0 6px 6px 0; margin: 24px 0; }
    .callout-box h4 { margin: 0 0 6px; font-size: 14px; color: #1A2E1A; text-transform: uppercase; letter-spacing: 0.5px; }
    .callout-box p { margin: 0; font-size: 13.5px; line-height: 1.5; color: #3A3A3A; }
    .email-footer { background: #122312; padding: 28px 32px; text-align: center; color: rgba(255,255,255,0.7); font-size: 12px; line-height: 1.6; }
    .footer-links a { color: #D7A51D; text-decoration: none; margin: 0 8px; }
    .footer-links { margin-bottom: 12px; }
    @media only screen and (max-width: 620px) {
      .email-body { padding: 24px 20px !important; }
      .email-header { padding: 28px 20px !important; }
      .ledger-table td { padding: 10px 12px !important; font-size: 13px !important; }
    }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${e(preheader)}
  </div>
  <table role="presentation" width="100%" bgcolor="#F9F6F0" cellpadding="0" cellspacing="0">
    <tr>
      <td style="padding: 24px 12px;">
        <div class="email-container">
          <div class="email-header">
            <h1 class="brand-title">Adva<em>Bliss</em></h1>
            <div class="brand-sub">${e(BRAND.sub)}</div>
          </div>
          <div class="email-body">
            ${contentHtml}
          </div>
          <div class="email-footer">
            <div class="footer-links">
              <a href="tel:${e(BRAND.phone.replace(/\s+/g, ''))}">${e(BRAND.phoneDisplay)}</a> ·
              <a href="mailto:${e(BRAND.email)}">${e(BRAND.email)}</a>
            </div>
            <div>${e(BRAND.name)} · ${e(BRAND.location)}</div>
            <div style="margin-top: 8px; font-size: 11px; color: rgba(255,255,255,0.45);">
              This is an automated notification. For assistance, reach our concierge at ${e(BRAND.phoneDisplay)}.
            </div>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// -------------------------------------------------------------
// GUEST ACKNOWLEDGEMENTS (Sent to the customer)
// -------------------------------------------------------------

function buildContactGuestEmail({ name, email, phone, message, requestId }) {
  const contentHtml = `
    <span class="badge-ref">Reference: ${e(requestId)}</span>
    <h2 class="greeting">Hello ${e(name)},</h2>
    <p class="lead-text">
      Thank you for contacting <strong>${e(BRAND.name)}</strong>. We have received your enquiry and our guest relations desk is reviewing your message.
    </p>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Full Name</td><td class="ledger-value">${e(name)}</td></tr>
      <tr><td class="ledger-label">Email Address</td><td class="ledger-value">${e(email || "Not provided")}</td></tr>
      <tr><td class="ledger-label">Phone Number</td><td class="ledger-value">${e(phone || "Not provided")}</td></tr>
      <tr><td class="ledger-label">Message Summary</td><td class="ledger-value">${e(message)}</td></tr>
    </table>

    <div class="callout-box">
      <h4>What Happens Next</h4>
      <p>Our team will reach out directly within a few hours to assist you with your request. If your matter is urgent, please call our reception directly at <strong>${e(BRAND.phoneDisplay)}</strong>.</p>
    </div>
  `;

  return {
    subject: `Enquiry Received [${requestId}] — ${BRAND.name}`,
    html: emailWrapper({
      title: "We Have Received Your Enquiry",
      preheader: `Thank you for contacting ${BRAND.name}. Your reference is ${requestId}.`,
      contentHtml,
    }),
    text: `Hello ${name},\n\nThank you for contacting ${BRAND.name}. We have received your enquiry (Ref: ${requestId}).\n\nDetails:\n- Name: ${name}\n- Email: ${email || "Not provided"}\n- Phone: ${phone || "Not provided"}\n- Message: ${message}\n\nOur team will contact you shortly.\n\nWarm regards,\n${BRAND.name} Reservations Desk\n${BRAND.phoneDisplay}`,
  };
}

function buildAccommodationGuestEmail({
  fullName,
  email,
  phone,
  roomName,
  checkInDate,
  checkOutDate,
  nights,
  adults,
  children,
  estimatedTotal,
  specialRequests,
  requestId,
}) {
  const contentHtml = `
    <span class="badge-ref">Reservation Request Ref: ${e(requestId)}</span>
    <h2 class="greeting">Dear ${e(fullName)},</h2>
    <p class="lead-text">
      Thank you for choosing <strong>${e(BRAND.name)}</strong> in Ruiru. We have received your stay reservation request.
    </p>

    <div class="callout-box">
      <h4>Reservation Request Notice</h4>
      <p><strong>Please note:</strong> This is an initial availability and reservation request, not a finalized booking. Our reservations desk will verify room availability and contact you directly via phone or WhatsApp to confirm your stay and arrangement details.</p>
    </div>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Reserved Residence</td><td class="ledger-value">${e(roomName)}</td></tr>
      <tr><td class="ledger-label">Check-In Date</td><td class="ledger-value">${e(checkInDate)}</td></tr>
      <tr><td class="ledger-label">Check-Out Date</td><td class="ledger-value">${e(checkOutDate)}</td></tr>
      <tr><td class="ledger-label">Length of Stay</td><td class="ledger-value">${e(nights)} ${nights === 1 ? "Night" : "Nights"}</td></tr>
      <tr><td class="ledger-label">Guests</td><td class="ledger-value">${e(adults)} Adult${adults === 1 ? "" : "s"}${Number(children) > 0 ? `, ${children} Child${children === 1 ? "" : "ren"}` : ""}</td></tr>
      <tr><td class="ledger-label">Indicative Estimate</td><td class="ledger-value">${formatKSh(estimatedTotal)} <span style="font-size:11px;color:#6E6E6E;font-weight:normal;">(Subject to room availability & confirmation)</span></td></tr>
      <tr><td class="ledger-label">Contact Phone</td><td class="ledger-value">${e(phone)}</td></tr>
      <tr><td class="ledger-label">Contact Email</td><td class="ledger-value">${e(email)}</td></tr>
      ${specialRequests ? `<tr><td class="ledger-label">Special Requests</td><td class="ledger-value">${e(specialRequests)}</td></tr>` : ""}
    </table>

    <p style="font-size: 13.5px; color: #555555; line-height: 1.5; margin-top: 18px;">
      If you need immediate assistance or would like to make changes to your request, please reach out directly at <strong>${e(BRAND.phoneDisplay)}</strong>.
    </p>
  `;

  return {
    subject: `Accommodation Request Received [${requestId}] — ${BRAND.name}`,
    html: emailWrapper({
      title: "Accommodation Request Received",
      preheader: `We have received your stay request for ${roomName} (${checkInDate} to ${checkOutDate}). Reference: ${requestId}.`,
      contentHtml,
    }),
    text: `Dear ${fullName},\n\nThank you for choosing ${BRAND.name}. We have received your accommodation request (Ref: ${requestId}).\n\nPlease note: This is a request and is subject to availability and direct confirmation from our desk.\n\nSummary:\n- Room: ${roomName}\n- Check-In: ${checkInDate}\n- Check-Out: ${checkOutDate}\n- Stay: ${nights} nights\n- Guests: ${adults} Adults, ${children} Children\n- Indicative Estimate: ${formatKSh(estimatedTotal)}\n- Phone: ${phone}\n- Email: ${email}\n${specialRequests ? `- Special Requests: ${specialRequests}\n` : ""}\nOur reservations desk will contact you within 2 hours.\n\nWarm regards,\n${BRAND.name}\n${BRAND.phoneDisplay}`,
  };
}

function buildRestaurantGuestEmail({
  fullName,
  email,
  phone,
  date,
  time,
  guests,
  seatingArea,
  occasion,
  specialRequests,
  requestId,
}) {
  const contentHtml = `
    <span class="badge-ref">Table Request Ref: ${e(requestId)}</span>
    <h2 class="greeting">Dear ${e(fullName)},</h2>
    <p class="lead-text">
      Thank you for reserving a table at <strong>${e(BRAND.name)} Restaurant & Garden Bar</strong>. We have received your dining reservation request.
    </p>

    <div class="callout-box">
      <h4>Table Request Status</h4>
      <p>Our restaurant concierge will review table availability for <strong>${e(seatingArea)}</strong> and reach out to you directly to confirm your seating and dietary requirements.</p>
    </div>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Reservation Date</td><td class="ledger-value">${e(date)}</td></tr>
      <tr><td class="ledger-label">Preferred Time</td><td class="ledger-value">${e(time)}</td></tr>
      <tr><td class="ledger-label">Party Size</td><td class="ledger-value">${e(guests)}</td></tr>
      <tr><td class="ledger-label">Seating Area</td><td class="ledger-value">${e(seatingArea)}</td></tr>
      <tr><td class="ledger-label">Occasion</td><td class="ledger-value">${e(occasion || "Casual Dining")}</td></tr>
      <tr><td class="ledger-label">Contact Phone</td><td class="ledger-value">${e(phone)}</td></tr>
      <tr><td class="ledger-label">Contact Email</td><td class="ledger-value">${e(email)}</td></tr>
      ${specialRequests && specialRequests !== "None" ? `<tr><td class="ledger-label">Special Requests</td><td class="ledger-value">${e(specialRequests)}</td></tr>` : ""}
    </table>

    <p style="font-size: 13.5px; color: #555555; line-height: 1.5; margin-top: 18px;">
      For urgent updates or large party arrangements, please reach our restaurant desk directly at <strong>${e(BRAND.phoneDisplay)}</strong>.
    </p>
  `;

  return {
    subject: `Table Reservation Request Received [${requestId}] — ${BRAND.name}`,
    html: emailWrapper({
      title: "Table Reservation Request Received",
      preheader: `Your table reservation request for ${guests} on ${date} at ${time} has been received. Ref: ${requestId}.`,
      contentHtml,
    }),
    text: `Dear ${fullName},\n\nThank you for reserving a table at ${BRAND.name}. We have received your table reservation request (Ref: ${requestId}).\n\nSummary:\n- Date: ${date}\n- Time: ${time}\n- Party: ${guests}\n- Seating Area: ${seatingArea}\n- Occasion: ${occasion || "None"}\n- Phone: ${phone}\n- Email: ${email}\n${specialRequests ? `- Special Requests: ${specialRequests}\n` : ""}\nOur restaurant concierge will contact you shortly to confirm.\n\nWarm regards,\n${BRAND.name}\n${BRAND.phoneDisplay}`,
  };
}

function buildMeetingGuestEmail({
  fullName,
  email,
  phone,
  eventType,
  eventDate,
  guests,
  addons,
  estimatedTotal,
  details,
  requestId,
}) {
  const addonsList = Array.isArray(addons) && addons.length > 0
    ? addons.map((a) => `<li>${e(a.name)} — ${formatKSh(a.price)}</li>`).join("")
    : "<li>None selected</li>";

  const contentHtml = `
    <span class="badge-ref">Event Enquiry Ref: ${e(requestId)}</span>
    <h2 class="greeting">Dear ${e(fullName)},</h2>
    <p class="lead-text">
      Thank you for considering <strong>${e(BRAND.name)}</strong> for your upcoming <strong>${e(eventType)}</strong>. We have received your event enquiry.
    </p>

    <div class="callout-box">
      <h4>Bespoke Event Coordination</h4>
      <p>Every event at AdvaBliss is tailored to perfection. Our events manager will get in touch with you within 24 hours to discuss your event vision, space layout, catering menu and custom setup.</p>
    </div>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Event Category</td><td class="ledger-value">${e(eventType)}</td></tr>
      <tr><td class="ledger-label">Anticipated Date</td><td class="ledger-value">${e(eventDate)}</td></tr>
      <tr><td class="ledger-label">Expected Guests</td><td class="ledger-value">${e(guests)} Attendees</td></tr>
      <tr><td class="ledger-label">Enhancements</td><td class="ledger-value"><ul style="margin:4px 0 4px 18px;padding:0;">${addonsList}</ul></td></tr>
      <tr><td class="ledger-label">Indicative Enhancements Total</td><td class="ledger-value">${formatKSh(estimatedTotal)}</td></tr>
      <tr><td class="ledger-label">Contact Phone</td><td class="ledger-value">${e(phone)}</td></tr>
      <tr><td class="ledger-label">Contact Email</td><td class="ledger-value">${e(email)}</td></tr>
      ${details && details !== "None" ? `<tr><td class="ledger-label">Event Details</td><td class="ledger-value">${e(details)}</td></tr>` : ""}
    </table>
  `;

  return {
    subject: `Event Enquiry Received [${requestId}] — ${BRAND.name}`,
    html: emailWrapper({
      title: "Event Enquiry Received",
      preheader: `Thank you for choosing ${BRAND.name} for your ${eventType}. Reference: ${requestId}.`,
      contentHtml,
    }),
    text: `Dear ${fullName},\n\nThank you for choosing ${BRAND.name}. We have received your event enquiry for a ${eventType} on ${eventDate} (Ref: ${requestId}).\n\nOur events manager will reach out shortly.\n\nWarm regards,\n${BRAND.name}\n${BRAND.phoneDisplay}`,
  };
}

// -------------------------------------------------------------
// ADMIN NOTIFICATIONS (Sent to MAIL_TO)
// -------------------------------------------------------------

function buildContactAdminEmail({ name, email, phone, message, requestId }) {
  const contentHtml = `
    <span class="badge-ref" style="background:#1A2E1A;color:#D7A51D;border-color:#D7A51D;">ADMIN NOTIFICATION: NEW ENQUIRY</span>
    <h2 class="greeting">New Website Contact Enquiry</h2>
    <p class="lead-text">A new general enquiry was submitted through the resort website.</p>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Reference ID</td><td class="ledger-value">${e(requestId)}</td></tr>
      <tr><td class="ledger-label">Guest Name</td><td class="ledger-value">${e(name)}</td></tr>
      <tr><td class="ledger-label">Guest Email</td><td class="ledger-value"><a href="mailto:${e(email)}">${e(email || "Not provided")}</a></td></tr>
      <tr><td class="ledger-label">Guest Phone</td><td class="ledger-value"><a href="tel:${e(phone)}">${e(phone || "Not provided")}</a></td></tr>
      <tr><td class="ledger-label">Message</td><td class="ledger-value">${e(message)}</td></tr>
    </table>
  `;

  return {
    subject: `[New Enquiry] from ${name} (Ref: ${requestId})`,
    html: emailWrapper({
      title: "New Website Enquiry",
      preheader: `New message from ${name} (${email || phone}). Ref: ${requestId}.`,
      contentHtml,
    }),
    text: `[ADMIN NOTIFICATION - NEW ENQUIRY]\nRef: ${requestId}\nName: ${name}\nEmail: ${email}\nPhone: ${phone}\n\nMessage:\n${message}`,
  };
}

function buildAccommodationAdminEmail({
  fullName,
  email,
  phone,
  roomName,
  checkInDate,
  checkOutDate,
  nights,
  adults,
  children,
  estimatedTotal,
  specialRequests,
  requestId,
}) {
  const contentHtml = `
    <span class="badge-ref" style="background:#1A2E1A;color:#D7A51D;border-color:#D7A51D;">ADMIN NOTIFICATION: ACCOMMODATION REQUEST</span>
    <h2 class="greeting">New Stay Request: ${e(roomName)}</h2>
    <p class="lead-text">A guest has requested a room reservation. Please verify availability and call/email the guest.</p>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Reference ID</td><td class="ledger-value">${e(requestId)}</td></tr>
      <tr><td class="ledger-label">Guest Full Name</td><td class="ledger-value">${e(fullName)}</td></tr>
      <tr><td class="ledger-label">Room / Suite</td><td class="ledger-value">${e(roomName)}</td></tr>
      <tr><td class="ledger-label">Check-In Date</td><td class="ledger-value">${e(checkInDate)}</td></tr>
      <tr><td class="ledger-label">Check-Out Date</td><td class="ledger-value">${e(checkOutDate)}</td></tr>
      <tr><td class="ledger-label">Total Nights</td><td class="ledger-value">${e(nights)}</td></tr>
      <tr><td class="ledger-label">Party Size</td><td class="ledger-value">${e(adults)} Adults, ${e(children)} Children</td></tr>
      <tr><td class="ledger-label">Estimated Total</td><td class="ledger-value">${formatKSh(estimatedTotal)}</td></tr>
      <tr><td class="ledger-label">Phone</td><td class="ledger-value"><a href="tel:${e(phone)}">${e(phone)}</a></td></tr>
      <tr><td class="ledger-label">Email</td><td class="ledger-value"><a href="mailto:${e(email)}">${e(email)}</a></td></tr>
      ${specialRequests ? `<tr><td class="ledger-label">Special Requests</td><td class="ledger-value">${e(specialRequests)}</td></tr>` : ""}
    </table>
  `;

  return {
    subject: `[Accommodation Request] ${fullName} — ${roomName} (${checkInDate} to ${checkOutDate}) [${requestId}]`,
    html: emailWrapper({
      title: "New Accommodation Request",
      preheader: `Stay request from ${fullName} for ${roomName} (${nights} nights). Ref: ${requestId}.`,
      contentHtml,
    }),
    text: `[ACCOMMODATION REQUEST]\nRef: ${requestId}\nGuest: ${fullName}\nRoom: ${roomName}\nCheck-in: ${checkInDate}\nCheck-out: ${checkOutDate} (${nights} nights)\nGuests: ${adults} Adults, ${children} Children\nEstimated Total: ${formatKSh(estimatedTotal)}\nPhone: ${phone}\nEmail: ${email}\n${specialRequests ? `Special Requests: ${specialRequests}\n` : ""}`,
  };
}

function buildRestaurantAdminEmail({
  fullName,
  email,
  phone,
  date,
  time,
  guests,
  seatingArea,
  occasion,
  specialRequests,
  requestId,
}) {
  const contentHtml = `
    <span class="badge-ref" style="background:#1A2E1A;color:#D7A51D;border-color:#D7A51D;">ADMIN NOTIFICATION: RESTAURANT RESERVATION</span>
    <h2 class="greeting">New Table Reservation Request</h2>
    <p class="lead-text">A diner has requested a table. Please review table allocations in the designated area.</p>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Reference ID</td><td class="ledger-value">${e(requestId)}</td></tr>
      <tr><td class="ledger-label">Guest Full Name</td><td class="ledger-value">${e(fullName)}</td></tr>
      <tr><td class="ledger-label">Reservation Date</td><td class="ledger-value">${e(date)}</td></tr>
      <tr><td class="ledger-label">Reservation Time</td><td class="ledger-value">${e(time)}</td></tr>
      <tr><td class="ledger-label">Number of Guests</td><td class="ledger-value">${e(guests)}</td></tr>
      <tr><td class="ledger-label">Seating Area</td><td class="ledger-value">${e(seatingArea)}</td></tr>
      <tr><td class="ledger-label">Occasion</td><td class="ledger-value">${e(occasion || "Casual Dining")}</td></tr>
      <tr><td class="ledger-label">Guest Phone</td><td class="ledger-value"><a href="tel:${e(phone)}">${e(phone)}</a></td></tr>
      <tr><td class="ledger-label">Guest Email</td><td class="ledger-value"><a href="mailto:${e(email)}">${e(email)}</a></td></tr>
      ${specialRequests && specialRequests !== "None" ? `<tr><td class="ledger-label">Special Requests</td><td class="ledger-value">${e(specialRequests)}</td></tr>` : ""}
    </table>
  `;

  return {
    subject: `[Table Reservation] ${fullName} — ${guests} on ${date} at ${time} [${requestId}]`,
    html: emailWrapper({
      title: "New Table Reservation Request",
      preheader: `Table request from ${fullName} for ${guests} on ${date} at ${time} (${seatingArea}). Ref: ${requestId}.`,
      contentHtml,
    }),
    text: `[TABLE RESERVATION REQUEST]\nRef: ${requestId}\nGuest: ${fullName}\nDate: ${date}\nTime: ${time}\nParty: ${guests}\nSeating Area: ${seatingArea}\nOccasion: ${occasion || "None"}\nPhone: ${phone}\nEmail: ${email}\n${specialRequests ? `Special Requests: ${specialRequests}\n` : ""}`,
  };
}

function buildMeetingAdminEmail({
  fullName,
  email,
  phone,
  eventType,
  eventDate,
  guests,
  addons,
  estimatedTotal,
  details,
  requestId,
}) {
  const addonsList = Array.isArray(addons) && addons.length > 0
    ? addons.map((a) => `<li>${e(a.name)} — ${formatKSh(a.price)}</li>`).join("")
    : "<li>None</li>";

  const contentHtml = `
    <span class="badge-ref" style="background:#1A2E1A;color:#D7A51D;border-color:#D7A51D;">ADMIN NOTIFICATION: EVENT ENQUIRY</span>
    <h2 class="greeting">New Meeting &amp; Event Enquiry</h2>
    <p class="lead-text">A client has submitted an enquiry for venue hire and event services.</p>

    <table class="ledger-table" cellpadding="0" cellspacing="0">
      <tr><td class="ledger-label">Reference ID</td><td class="ledger-value">${e(requestId)}</td></tr>
      <tr><td class="ledger-label">Client Name</td><td class="ledger-value">${e(fullName)}</td></tr>
      <tr><td class="ledger-label">Event Category</td><td class="ledger-value">${e(eventType)}</td></tr>
      <tr><td class="ledger-label">Event Date</td><td class="ledger-value">${e(eventDate)}</td></tr>
      <tr><td class="ledger-label">Expected Attendees</td><td class="ledger-value">${e(guests)}</td></tr>
      <tr><td class="ledger-label">Enhancements</td><td class="ledger-value"><ul style="margin:4px 0 4px 18px;padding:0;">${addonsList}</ul></td></tr>
      <tr><td class="ledger-label">Enhancements Total</td><td class="ledger-value">${formatKSh(estimatedTotal)}</td></tr>
      <tr><td class="ledger-label">Client Phone</td><td class="ledger-value"><a href="tel:${e(phone)}">${e(phone)}</a></td></tr>
      <tr><td class="ledger-label">Client Email</td><td class="ledger-value"><a href="mailto:${e(email)}">${e(email)}</a></td></tr>
      ${details && details !== "None" ? `<tr><td class="ledger-label">Event Vision / Details</td><td class="ledger-value">${e(details)}</td></tr>` : ""}
    </table>
  `;

  return {
    subject: `[Event Enquiry] ${fullName} — ${eventType} on ${eventDate} [${requestId}]`,
    html: emailWrapper({
      title: "New Event Enquiry",
      preheader: `Event enquiry from ${fullName} for ${eventType} on ${eventDate}. Ref: ${requestId}.`,
      contentHtml,
    }),
    text: `[EVENT ENQUIRY]\nRef: ${requestId}\nClient: ${fullName}\nEvent: ${eventType}\nDate: ${eventDate}\nGuests: ${guests}\nPhone: ${phone}\nEmail: ${email}\n${details ? `Details: ${details}\n` : ""}`,
  };
}

module.exports = {
  BRAND,
  formatKSh,
  buildContactGuestEmail,
  buildAccommodationGuestEmail,
  buildRestaurantGuestEmail,
  buildMeetingGuestEmail,
  buildContactAdminEmail,
  buildAccommodationAdminEmail,
  buildRestaurantAdminEmail,
  buildMeetingAdminEmail,
};
