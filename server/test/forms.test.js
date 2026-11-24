const assert = require("assert");
const http = require("http");

process.env.NODE_ENV = "test";
process.env.RESEND_API_KEY = "re_test_mock_key_12345";
process.env.MAIL_TO = "admin@advabliss.com";
process.env.MAIL_FROM = "reservations@advabliss.com";
process.env.RESEND_CONTACT_TEMPLATE_ID = "tmpl_contact";
process.env.RESEND_ACCOMMODATION_TEMPLATE_ID = "tmpl_accom";
process.env.RESEND_RESTAURANT_TEMPLATE_ID = "tmpl_rest";
process.env.CORS_ORIGINS = "https://advabliss-resort-ruiru.vercel.app,http://localhost:5173";

const app = require("../index");
const { setResendClient } = require("../controllers/formController");

// Mock Resend Client Factory
function createMockResend({ sendFn } = {}) {
  const sentEmails = [];
  return {
    sentEmails,
    emails: {
      send: async (payload) => {
        sentEmails.push(payload);
        if (typeof sendFn === "function") {
          return sendFn(payload, sentEmails.length);
        }
        return { data: { id: `email_${Date.now()}` }, error: null };
      },
    },
  };
}

let server;
let baseUrl;

async function startServer() {
  return new Promise((resolve) => {
    server = http.createServer(app);
    server.listen(0, "127.0.0.1", () => {
      const port = server.address().port;
      baseUrl = `http://127.0.0.1:${port}`;
      resolve();
    });
  });
}

async function stopServer() {
  return new Promise((resolve) => {
    server.close(() => resolve());
  });
}

async function request(path, options = {}) {
  const url = `${baseUrl}${path}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...(options.body ? { "Content-Type": "application/json" } : {}),
      ...(options.headers || {}),
    },
  });

  const text = await response.text();
  let json = null;
  try {
    json = JSON.parse(text);
  } catch (e) {
    json = null;
  }

  return {
    status: response.status,
    headers: response.headers,
    body: json,
    rawText: text,
  };
}

async function runTests() {
  console.log("=================================================");
  console.log("RUNNING ADVABLISS RESORT BACKEND TEST SUITE");
  console.log("=================================================");

  await startServer();

  let passed = 0;
  let failed = 0;

  async function test(name, fn) {
    try {
      await fn();
      console.log(`  ✓ ${name}`);
      passed++;
    } catch (err) {
      console.error(`  ✗ ${name}`);
      console.error(err);
      failed++;
    }
  }

  // 1. GET /health
  await test("1. GET /health returns status ok and email status", async () => {
    const res = await request("/health");
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.status, "ok");
    assert.strictEqual(typeof res.body.timestamp, "string");
  });

  // 2. Successful CORS preflight from production Vercel domain
  await test("2. Successful CORS preflight from production Vercel domain", async () => {
    const res = await request("/api/contact", {
      method: "OPTIONS",
      headers: {
        Origin: "https://advabliss-resort-ruiru.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "Content-Type",
      },
    });
    assert.strictEqual(res.status, 204);
    assert.strictEqual(
      res.headers.get("access-control-allow-origin"),
      "https://advabliss-resort-ruiru.vercel.app"
    );
  });

  // 3. Rejection of unauthorized origin
  await test("3. Rejection of an unauthorized origin", async () => {
    const res = await request("/api/contact", {
      method: "POST",
      headers: {
        Origin: "https://unauthorized-malicious-site.com",
      },
      body: JSON.stringify({ name: "Hacker", message: "Hello", email: "h@bad.com" }),
    });
    assert.strictEqual(res.status, 403);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, "CORS error: Request origin is not permitted.");
  });

  // 4. Successful contact request with mocked Resend
  await test("4. Successful contact request sends admin and guest emails", async () => {
    const mockResend = createMockResend();
    setResendClient(mockResend);

    const res = await request("/api/contact", {
      method: "POST",
      headers: { Origin: "https://advabliss-resort-ruiru.vercel.app" },
      body: JSON.stringify({
        name: "Fredrick Mwangi",
        email: "guest@example.com",
        phone: "+254712345678",
        message: "I would like to enquire about visiting this weekend.",
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.emailStatus.admin, true);
    assert.strictEqual(res.body.emailStatus.guest, true);
    assert.ok(res.body.requestId.startsWith("ADV-CON-"));

    // Check emails sent: 1 admin + 1 guest
    assert.strictEqual(mockResend.sentEmails.length, 2);
    // Admin notification
    assert.strictEqual(mockResend.sentEmails[0].to[0], "admin@advabliss.com");
    assert.strictEqual(mockResend.sentEmails[0].template.id, "tmpl_contact");
    assert.strictEqual(mockResend.sentEmails[0].template.variables.NAME, "Fredrick Mwangi");
    // Guest acknowledgement
    assert.strictEqual(mockResend.sentEmails[1].to, "guest@example.com");
    assert.ok(mockResend.sentEmails[1].subject.includes("Enquiry Received"));
  });

  // 5. Invalid contact submission
  await test("5. Invalid contact submission (missing required fields, bad email)", async () => {
    const resEmpty = await request("/api/contact", {
      method: "POST",
      body: JSON.stringify({}),
    });
    assert.strictEqual(resEmpty.status, 400);
    assert.strictEqual(resEmpty.body.success, false);

    const resBadEmail = await request("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Valid Name", message: "Valid message text", email: "not-an-email" }),
    });
    assert.strictEqual(resBadEmail.status, 400);
    assert.strictEqual(resBadEmail.body.success, false);
  });

  // 6. Successful accommodation request
  await test("6. Successful accommodation request calculates nights, room name, and estimated total", async () => {
    const mockResend = createMockResend();
    setResendClient(mockResend);

    const res = await request("/api/book-accommodation", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Wanjiku Karanja",
        email: "wanjiku@example.com",
        phone: "+254799000111",
        accommodationType: "deluxe",
        checkInDate: "2026-12-10",
        checkOutDate: "2026-12-13",
        adults: 2,
        children: 1,
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.requestId.startsWith("ADV-ACC-"));
    assert.strictEqual(res.body.reservation.roomType, "Deluxe Forest Suite");
    assert.strictEqual(res.body.reservation.nights, 3);
    assert.strictEqual(res.body.reservation.estimatedTotal, 13500); // 3 nights * KSh 4500
    assert.strictEqual(res.body.emailStatus.admin, true);
    assert.strictEqual(res.body.emailStatus.guest, true);
  });

  // 7. Invalid accommodation dates
  await test("7. Invalid accommodation dates (check-out before check-in, past date)", async () => {
    const resInverted = await request("/api/book-accommodation", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Guest Name",
        email: "guest@example.com",
        phone: "+254700000000",
        accommodationType: "deluxe",
        checkInDate: "2026-12-15",
        checkOutDate: "2026-12-10",
      }),
    });
    assert.strictEqual(resInverted.status, 400);
    assert.strictEqual(resInverted.body.message, "Check-out date must be after check-in date.");

    const resPast = await request("/api/book-accommodation", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Guest Name",
        email: "guest@example.com",
        phone: "+254700000000",
        accommodationType: "deluxe",
        checkInDate: "2020-01-01",
        checkOutDate: "2020-01-05",
      }),
    });
    assert.strictEqual(resPast.status, 400);
    assert.strictEqual(resPast.body.message, "Check-in date cannot be in the past.");
  });

  // 8. Successful restaurant reservation
  await test("8. Successful restaurant reservation returns structured summary", async () => {
    const mockResend = createMockResend();
    setResendClient(mockResend);

    const res = await request("/api/book-restaurant", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Chef Patron",
        date: "2026-12-25",
        time: "19:30",
        guests: "4 Guests",
        seatingArea: "Lakeside Terrace",
        occasion: "Christmas Dinner",
        phone: "+254711223344",
        email: "diner@example.com",
        requests: "Window seat please",
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.ok(res.body.requestId.startsWith("ADV-RES-"));
    assert.strictEqual(res.body.reservation.seatingArea, "Lakeside Terrace");
    assert.strictEqual(res.body.reservation.occasion, "Christmas Dinner");
    assert.strictEqual(res.body.emailStatus.admin, true);
    assert.strictEqual(res.body.emailStatus.guest, true);
  });

  // 9. Separate seating-area and occasion mapping
  await test("9. Separate seating-area and occasion mapping handles legacy concatenated strings", async () => {
    const mockResend = createMockResend();
    setResendClient(mockResend);

    const res = await request("/api/book-restaurant", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Legacy Diner",
        date: "2026-12-25",
        time: "13:00",
        guests: "2",
        occasion: "The Canopy Garden · Birthday Celebration",
        phone: "+254711223344",
        email: "legacy@example.com",
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.reservation.seatingArea, "The Canopy Garden");
    assert.strictEqual(res.body.reservation.occasion, "Birthday Celebration");
  });

  // 10. Missing or invalid template configuration falls back gracefully
  await test("10. Missing or invalid template configuration falls back cleanly to branded HTML", async () => {
    const config = require("../config/env");
    const originalTemplate = config.templateIds.contact;
    config.templateIds.contact = ""; // clear template

    const mockResend = createMockResend();
    setResendClient(mockResend);

    const res = await request("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Fallback Test",
        email: "fallback@example.com",
        phone: "+254711223344",
        message: "Testing HTML fallback email delivery.",
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    // Verified that HTML fallback was sent
    assert.ok(mockResend.sentEmails[0].html.includes("New Website Contact Enquiry"));

    // Restore template
    config.templateIds.contact = originalTemplate;
  });

  // 11. Resend API failure handling (admin email provider failure -> 502)
  await test("11. Resend API failure handling returns 502 on admin notification error", async () => {
    const mockResend = createMockResend({
      sendFn: () => ({
        data: null,
        error: { message: "API key revoked", statusCode: 401 },
      }),
    });
    setResendClient(mockResend);

    const res = await request("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Failure Tester",
        email: "fail@example.com",
        phone: "+254711223344",
        message: "This should fail because provider returned error.",
      }),
    });

    assert.strictEqual(res.status, 502);
    assert.strictEqual(res.body.success, false);
    assert.strictEqual(res.body.message, "Failed to send message. Please contact reception directly.");
  });

  // 12. Admin email succeeds but guest email fails
  await test("12. Admin email succeeds but guest email fails (returns 200 with guest: false)", async () => {
    let callCount = 0;
    const mockResend = createMockResend({
      sendFn: (payload) => {
        callCount++;
        // 1st call (admin) succeeds, 2nd call (guest) fails
        if (callCount === 1) {
          return { data: { id: "admin_ok" }, error: null };
        }
        return { data: null, error: { message: "Customer email bounced", statusCode: 422 } };
      },
    });
    setResendClient(mockResend);

    const res = await request("/api/contact", {
      method: "POST",
      body: JSON.stringify({
        name: "Guest Fail Tester",
        email: "bouncing@example.com",
        phone: "+254711223344",
        message: "Admin should receive this, guest should fail gracefully.",
      }),
    });

    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.body.success, true);
    assert.strictEqual(res.body.emailStatus.admin, true);
    assert.strictEqual(res.body.emailStatus.guest, false);
  });

  // 13. Consistent API response structures across endpoints
  await test("13. Consistent API response structures across contact, accommodation, restaurant, meeting", async () => {
    const mockResend = createMockResend();
    setResendClient(mockResend);

    const contactRes = await request("/api/contact", {
      method: "POST",
      body: JSON.stringify({ name: "Consistency Test", email: "c@test.com", phone: "+254700000000", message: "Consistency check" }),
    });
    assert.strictEqual(typeof contactRes.body.success, "boolean");
    assert.strictEqual(typeof contactRes.body.requestId, "string");
    assert.strictEqual(typeof contactRes.body.emailStatus.admin, "boolean");
    assert.strictEqual(typeof contactRes.body.emailStatus.guest, "boolean");

    const accomRes = await request("/api/book-accommodation", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Consistency Test",
        email: "c@test.com",
        phone: "+254700000000",
        accommodationType: "family",
        checkInDate: "2026-12-10",
        checkOutDate: "2026-12-12",
        adults: 2,
        children: 1,
      }),
    });
    assert.strictEqual(typeof accomRes.body.success, "boolean");
    assert.strictEqual(typeof accomRes.body.requestId, "string");
    assert.strictEqual(typeof accomRes.body.reservation, "object");
    assert.strictEqual(typeof accomRes.body.emailStatus.admin, "boolean");

    const restRes = await request("/api/book-restaurant", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Consistency Test",
        email: "c@test.com",
        phone: "+254700000000",
        date: "2026-12-10",
        time: "19:00",
        guests: "2",
      }),
    });
    assert.strictEqual(typeof restRes.body.success, "boolean");
    assert.strictEqual(typeof restRes.body.requestId, "string");
    assert.strictEqual(typeof restRes.body.reservation, "object");

    const meetRes = await request("/api/book-meeting", {
      method: "POST",
      body: JSON.stringify({
        fullName: "Consistency Test",
        email: "c@test.com",
        phone: "+254700000000",
        eventType: "Corporate Events",
        eventDate: "2026-12-15",
        guests: 50,
        addonIds: ["sound", "lighting"],
      }),
    });
    assert.strictEqual(typeof meetRes.body.success, "boolean");
    assert.strictEqual(typeof meetRes.body.requestId, "string");
    assert.strictEqual(typeof meetRes.body.event, "object");
    assert.strictEqual(meetRes.body.event.estimatedTotal, 650); // sound (300) + lighting (350)
  });

  await stopServer();

  console.log("=================================================");
  console.log(`TEST RESULTS: ${passed} passed, ${failed} failed`);
  console.log("=================================================");

  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch((err) => {
  console.error("Test runner crashed:", err);
  process.exit(1);
});
