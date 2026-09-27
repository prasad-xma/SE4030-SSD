const express = require("express");
const { register, login, logout, getCurrentUser } = require("../controller/auth.controller.js");
const {
  validateUser,
  authenticateUser,
} = require("../middleware/auth.middleware.js");
const { loginRateLimiter } = require("../middleware/rateLimit.middleware.js");
const { googleLogin, googleCallback } = require("../controller/googleAuth.controller.js");
const { getGoogleSignup, completeGoogleSignup } = require("../controller/googleSignup.controller.js");

const router = express.Router();

router.post("/register", validateUser, register);
router.post("/login", loginRateLimiter, login);
router.post("/logout", logout);
router.get("/me", authenticateUser, getCurrentUser);
router.get("/google", googleLogin);
router.get("/google/callback", googleCallback);
router.get("/google/signup", getGoogleSignup);
router.post("/google/signup", completeGoogleSignup);

module.exports = router;
