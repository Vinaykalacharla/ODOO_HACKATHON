import rateLimit from 'express-rate-limit';

/**
 * Rate limiter for authentication routes
 * Max 10 requests per 15 minutes on /api/auth/*
 */
export const authRateLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // limit each IP to 10 requests per windowMs
  message: {
    success: false,
    data: null,
    error: 'Too many requests. Please try again after 15 minutes.',
    meta: null
  },
  standardHeaders: true,
  legacyHeaders: false,
});
