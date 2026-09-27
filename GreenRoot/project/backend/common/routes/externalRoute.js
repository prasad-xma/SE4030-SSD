const express = require("express");
const rateLimit = require("express-rate-limit");
const { getCities, getNews } = require("../controller/externalController.js");
const { authenticateUser } = require("../../admin/middleware/auth.middleware.js");

const router = express.Router();

const externalApiLimiter = rateLimit({
    windowMs: 60 * 1000,
    max: 30,
    standardHeaders: true,
    legacyHeaders: false,
    message: { err: "Too many requests. Please try again later." },
});

router.get("/cities", authenticateUser, externalApiLimiter, getCities);
router.get("/news", authenticateUser, externalApiLimiter, getNews);

module.exports = router;
