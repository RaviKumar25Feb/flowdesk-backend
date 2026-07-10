const express = require("express");
const router = express.Router();

const auth = require("../middlewares/auth.middleware");
const validate = require("../middlewares/validation.middleware");

const {
  sendOTP,
  signup,
  login,
  logout,
} = require("../controllers/auth.controller");

const {
  sendOTPValidation,
  registerValidation,
  loginValidation,
} = require("../validations/auth.validation");

router.post("/send-otp", sendOTPValidation, validate, sendOTP);
router.post("/signup", registerValidation, validate, signup);
router.post("/login", loginValidation, validate, login);
router.post("/logout", auth, logout);

module.exports = router;
