const express = require("express");
const router = express.Router();
const rateLimit = require("express-rate-limit");
const {
  signup,
  login,
  protectedRoute,
} = require("../controllers/auth.controller");
const authenticateToken = require("../middlewares/authenticate.middleware");
const { rateLimiter } = require("../middlewares/rateLimiter.middleware");
// const loginLimiter = require("../middlewares/loginLimiter.middleware");

// In-memory IP blocking database
const blockedIPs = {};

// IP blocking middleware for /login route
const loginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5, // Max 5 failed attempts
  keyGenerator: (req) => req.ip,
  handler: (req, res) => {
    blockedIPs[req.ip] = true;
    res.status(429).json({
      message: "Too many failed login attempts, please try again later.",
    });
  },
});

router.post("/signup", signup);
router.post("/login", loginLimiter, login);
router.get("/protected", authenticateToken, protectedRoute);
router.get("/users", rateLimiter, (req, res) => {
  res.send("Users route");
});

module.exports = router;
