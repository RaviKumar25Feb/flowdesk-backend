const rateLimit = require("express-rate-limit");

// Login
exports.loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 5, // 5 Maximum Attempts
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Too many login attempts. Please try again after 15 minutes.",
    });
  },
});

// Forgot Password
exports.forgotPasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Hour
  max: 3, // 3 Maximum Attempts
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many password forgot requests. Please try again after 1 hour.",
    });
  },
});

// Reset Password
exports.resetPasswordLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 Minutes
  max: 3, // 3 Maximum Attempts
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message:
        "Too many reset password attempts. Please try again after 15 minutes.",
    });
  },
});

// Change Password
exports.changePasswordLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 Hour
  max: 3, // 3 Maximum Attempts
  standardHeaders: true,
  legacyHeaders: false,

  handler: (req, res) => {
    return res.status(429).json({
      success: false,
      message: "Password change limit exceeded. Please try again after 1 hour.",
    });
  },
});
