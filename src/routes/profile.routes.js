const express = require("express");
const router = express.Router();
const { auth } = require("../middlewares/auth.middleware");
const {
  getProfile,
  updateProfile,
  deleteProfile,
  updateAvatar,
} = require("../controllers/profile.controller");
const upload = require("../middlewares/upload.middleware");
const { validate } = require("../middlewares/validation.middleware");
const {
  updateProfileValidation,
  deleteProfileValidation,
} = require("../validations/profile.validation");

//map routes with controllers
router.get("/me", auth, getProfile);
router.put("/update", auth, updateProfileValidation, validate, updateProfile);
router.put("/avatar", auth, upload.single("avatar"), updateAvatar);
router.delete(
  "/delete",
  auth,
  deleteProfileValidation,
  validate,
  deleteProfile,
);

module.exports = router;
