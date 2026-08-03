const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  updateAvatar,
} = require("../controllers/profile.controller");
const upload = require("../middlewares/upload.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
  updateProfileValidation,
} = require("../validations/profile.validation");

//map routes with controllers
router.get("/", auth, getProfile);
router.put("/update", auth, updateProfileValidation, validate, updateProfile);
router.patch("/avatar", auth, upload.single("avatar"), updateAvatar);

module.exports = router;
