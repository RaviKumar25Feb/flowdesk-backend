const { body } = require("express-validator");
const { ROLES } = require("../constants/roles");

// Send OTP Validation
exports.sendOTPValidation = [
  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email."),
];

// Register Validation
exports.registerValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters."),

  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("password")
    .notEmpty()
    .withMessage("Password is required.")
    .isLength({ min: 6, max: 20 })
    .withMessage("Password must be between 6 and 20 characters."),

  body("confirmPassword")
    .notEmpty()
    .withMessage("Confirm password is required.")
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password and confirm password do not match.");
      }
      return true;
    }),

  body("role")
    .trim()
    .notEmpty()
    .withMessage("Role is required.")
    .isIn(Object.values(ROLES))
    .withMessage("Invalid role selected."),

  body("otp")
    .trim()
    .notEmpty()
    .withMessage("OTP is required.")
    .isNumeric()
    .withMessage("OTP must contain only numbers.")
    .isLength({ min: 6, max: 6 })
    .withMessage("OTP must be exactly 6 digits."),
];

// Login Validation
exports.loginValidation = [
  body("email")
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("password").notEmpty().withMessage("Password is required."),
];
