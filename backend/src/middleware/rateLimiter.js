const rateLimit = require('express-rate-limit');

// General API rate limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 200,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes.',
    timestamp: new Date().toISOString()
  }
});

// Stricter rate limiter for AI queries
const assistantLimiter = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Assistant rate limit reached. Please wait a minute before sending another question.',
    timestamp: new Date().toISOString()
  }
});

// Stricter limiter for payment creation
const paymentLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 25,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many payment requests. Please try again shortly.',
    timestamp: new Date().toISOString()
  }
});

module.exports = {
  apiLimiter,
  assistantLimiter,
  paymentLimiter
};
