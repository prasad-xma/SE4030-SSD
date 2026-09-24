const rateLimit = require("express-rate-limit");

// Blocks brute-force login attempts: 5 tries per 15 minutes per IP
const loginRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 5,
    standardHeaders: true,
    legacyHeaders: false,
    message: { err: "Too many login attempts. Please try again after 15 minutes." },
});

module.exports = { loginRateLimiter };
