const express = require("express");
const router = express.Router();

const { ROLES } = require("../constants/roles");

const {
  createUser,
  getAllUsers,
  getUserById,
  updateUser,
  activateUser,
  deactivateUser,
} = require("../controllers/user.controller");

const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validation.middleware");

const {
  createUserValidation,
  updateUserValidation,
} = require("../validations/user.validation");

//====================== MANAGER ROUTES ======================

//Create Developer / Client
router.post(
  "/",
  auth,
  authorize(ROLES.MANAGER),
  createUserValidation,
  validate,
  createUser,
);

//Get All Users
router.get("/", auth, authorize(ROLES.MANAGER), getAllUsers);

//Get User Details
router.get("/:userId", auth, authorize(ROLES.MANAGER), getUserById);

//Update User
router.patch(
  "/:userId/update",
  auth,
  authorize(ROLES.MANAGER),
  updateUserValidation,
  validate,
  updateUser,
);

//Deactivate User
router.patch("/:userId/deactivate", auth, authorize(ROLES.MANAGER), deactivateUser);

//Activate User
router.patch("/:userId/activate", auth, authorize(ROLES.MANAGER), activateUser);

module.exports = router;
