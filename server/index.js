require("dotenv").config();

const express = require("express");
const cors = require("cors");

const config = require("./config/env");
const formRoutes = require("./routes/forms");

const app = express();

// Render sits behind a proxy
app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, callback) {
      // Allow non-browser clients (curl, health checks) with no Origin header
      if (!origin) return callback(null, true);
      // Local development
      if (!config.isProduction && /^https?:\/\/localhost(:\d+)?$/.test(origin)) {
        return callback(null, true);
      }
      if (config.corsOrigins.includes(origin.replace(/\/$/, ""))) {
        return callback(null, true);
      }
      return callback(null, false);
    },
    methods: ["GET", "POST", "OPTIONS"],
  })
);
app.use(express.json({ limit: "100kb" }));

// Health check for Render
app.get("/health", (req, res) => {
  res.json({ status: "ok", emailConfigured: config.missing.length === 0 });
});

app.use("/api", formRoutes);

app.use((req, res) => {
  res.status(404).json({ success: false, message: "Route not found" });
});

// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err);
  const status = err.status || err.statusCode || 500;
  res.status(status).json({
    success: false,
    message: status === 400 ? "Invalid request body" : "Internal server error",
  });
});

app.listen(config.port, "0.0.0.0", () => {
  console.log(`Server running on port ${config.port}`);
  if (config.missing.length) {
    console.warn(`Missing environment variables: ${config.missing.join(", ")} — form emails will fail.`);
  }
  if (config.isProduction && config.corsOrigins.length === 0) {
    console.warn("CORS_ORIGINS is empty — browsers from your frontend domain will be blocked.");
  }
});
