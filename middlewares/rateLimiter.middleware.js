const rateLimit = require("express-rate-limit");

module.exports.rateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 100, // 100 requests in 1 min
  message: "You have exceeded the 100 requests in 1 min limit!",
  standardHeaders: true,
  legacyHeaders: false,
});
