require("dotenv").config();

const express = require("express");
const cors = require("cors");

const config = require("./config/env");
const formRoutes = require("./routes/forms");
const createRateLimiter = require("./middleware/rateLimiter");

const app = express();

// Render sits behind a proxy; needed for accurate client IP detection & rate limiting
app.set("trust proxy", 1);

// Configure CORS
const corsOptions = {
  origin(origin, callback) {
    // Allow non-browser clients (curl, health checks, server-to-server) with no Origin header
    if (!origin) {
      return callback(null, true);
    }

    const normalizedOrigin = origin.trim().replace(/\/+$/, "");

    // Check against configured allowed origins
    if (config.corsOrigins.includes(normalizedOrigin)) {
      return callback(null, true);
    }

    // Local development regex (localhost with any port or 127.0.0.1)
    if (!config.isProduction && /^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(normalizedOrigin)) {
      return callback(null, true);
    }

    // Origin is not allowed
    console.warn(`[cors] Rejected origin: ${normalizedOrigin}`);
    return callback(new Error("Not allowed by CORS"));
  },
  methods: ["GET", "POST", "OPTIONS", "PUT", "PATCH", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
  optionsSuccessStatus: 204,
};

// Apply CORS before any route definitions (handles both standard requests and preflight OPTIONS)
app.use(cors(corsOptions));

// JSON body parsing with strict size limit
app.use(express.json({ limit: "100kb" }));

// Health check endpoint for Render and uptime monitoring
app.get("/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    emailConfigured: config.missing.length === 0,
  });
});

// Apply rate limiting specifically to form submission routes
const apiRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // 30 submissions per window
});

app.use("/api", apiRateLimiter, formRoutes);

// 404 handler for unknown routes
app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// Central error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  if (err && err.message === "Not allowed by CORS") {
    return res.status(403).json({
      success: false,
      message: "CORS error: Request origin is not permitted.",
    });
  }

  console.error("[server] Unhandled error:", err?.message || err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 400 ? "Invalid request body" : "Internal server error",
  });
});

if (process.env.NODE_ENV !== "test") {
  app.listen(config.port, "0.0.0.0", () => {
    console.log(`[server] AdvaBliss Resort API running on port ${config.port}`);
    if (config.missing.length > 0) {
      console.warn(`[server] Missing environment variables: ${config.missing.join(", ")}`);
    }
    if (config.isProduction && config.corsOrigins.length === 0) {
      console.warn("[server] CORS_ORIGINS is empty — requests from frontend domain will be blocked.");
    }
  });
}

module.exports = app;
