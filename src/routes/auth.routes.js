const express = require("express");
const router = express.Router();

//import req data validation
const {
  sendOTPValidation,
  signupValidation,
  loginValidation,
  changePasswordValidation,
  createTokenValidation,
  resetPasswordValidation,
} = require("../validations/auth.validation");

//import error validation middleware
const { validate } = require("../middlewares/validation.middleware");

//import authentication middleware
const { auth } = require("../middlewares/auth.middleware");

//import authorization middleware
const { authorize } = require("../middlewares/role.middleware");

//import authentication controllers
const {
  sendOTP,
  signup,
  login,
  logout,
  changePassword,
  createToken,
  resetPassword,
} = require("../controllers/auth.controller");

//mapping authentication controllers
router.post("/send-otp", sendOTPValidation, validate, sendOTP);
router.post("/signup", signupValidation, validate, signup);
router.post("/login", loginValidation, validate, login);
router.post("/logout", auth, logout);
router.post("/forgot-password", createTokenValidation, validate, createToken);
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword,
);
router.put(
  "/change-password",
  auth,
  changePasswordValidation,
  validate,
  changePassword,
);

module.exports = router;
