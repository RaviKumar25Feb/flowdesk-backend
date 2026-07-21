const express = require("express");
const router = express.Router();

const { getManagerDashboard } = require("../controllers/dashboard.controller");
const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { ROLES } = require("../constants/roles");

router.get("/manager", auth, authorize(ROLES.MANAGER), getManagerDashboard);

module.exports = router;
