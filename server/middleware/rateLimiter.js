// Lightweight in-memory rate limiter for public forms.
// Zero extra dependencies, memory safe with automatic cleanup.
function createRateLimiter(options = {}) {
  const windowMs = options.windowMs || 15 * 60 * 1000; // 15 minutes
  const max = options.max || 30; // 30 requests per window
  const message = options.message || "Too many requests from this address. Please try again in a few minutes.";

  const hits = new Map();

  // Periodically clean up expired records every 5 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [ip, entry] of hits.entries()) {
      if (now > entry.resetTime) {
        hits.delete(ip);
      }
    }
  }, 5 * 60 * 1000);

  if (cleanupInterval.unref) {
    cleanupInterval.unref();
  }

  return function rateLimiter(req, res, next) {
    // In dev / test or if disabled, pass through
    if (process.env.NODE_ENV === "test") {
      return next();
    }

    const ip = req.ip || req.headers["x-forwarded-for"] || req.socket?.remoteAddress || "unknown-ip";
    const now = Date.now();

    let entry = hits.get(ip);
    if (!entry || now > entry.resetTime) {
      entry = {
        count: 1,
        resetTime: now + windowMs,
      };
      hits.set(ip, entry);
    } else {
      entry.count += 1;
    }

    const remaining = Math.max(0, max - entry.count);
    const resetSeconds = Math.ceil((entry.resetTime - now) / 1000);

    res.setHeader("X-RateLimit-Limit", max);
    res.setHeader("X-RateLimit-Remaining", remaining);
    res.setHeader("X-RateLimit-Reset", resetSeconds);

    if (entry.count > max) {
      console.warn(`[rate-limit] Throttled IP ${ip.slice(0, 16)} on ${req.method} ${req.originalUrl}`);
      return res.status(429).json({
        success: false,
        message,
        retryAfterSeconds: resetSeconds,
      });
    }

    next();
  };
}

module.exports = createRateLimiter;
