// middleware/rateLimiter.js
const rateLimit = require('express-rate-limit');

// Applied to the public lead-submission endpoint to prevent abuse/spam.
const leadRateLimiter = rateLimit({
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 min
  max: Number(process.env.RATE_LIMIT_MAX) || 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests. Please try again later.',
  },
});

// A looser limiter for general API traffic.
const generalRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 300,
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = { leadRateLimiter, generalRateLimiter };
