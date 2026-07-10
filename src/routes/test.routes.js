const express = require("express");
const auth = require("../middlewares/auth.middleware");
const authorize = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");
const router = express.Router();

// API Health Check
router.get("/", (req, res) => {
  return res.status(200).json({
    success: true,
    message: "FlowDesk API is running 🚀",
  });
});

// Auth Middleware Test
router.get("/me", auth, (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Authenticated User",
    user: req.user,
  });
});

// Manager Route Test
router.get("/manager", auth, authorize(ROLES.MANAGER), (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Manager",
  });
});

// Developer Route Test
router.get("/developer", auth, authorize(ROLES.DEVELOPER), (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Developer",
  });
});

// Client Route Test
router.get("/client", auth, authorize(ROLES.CLIENT), (req, res) => {
  return res.status(200).json({
    success: true,
    message: "Welcome Client",
  });
});

module.exports = router;
