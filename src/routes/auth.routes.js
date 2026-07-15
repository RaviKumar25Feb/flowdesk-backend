const express = require("express");
const router = express.Router();

//import req data validation
const {
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
  login,
  logout,
  changePassword,
  createToken,
  resetPassword,
} = require("../controllers/auth.controller");

//mapping authentication controllers
router.post("/login", loginValidation, validate, login);
router.post("/logout", auth, logout);
router.put(
  "/change-password",
  auth,
  changePasswordValidation,
  validate,
  changePassword,
);
router.post(
  "/reset-password-token",
  createTokenValidation,
  validate,
  createToken,
);
router.post(
  "/reset-password",
  resetPasswordValidation,
  validate,
  resetPassword,
);

module.exports = router;
