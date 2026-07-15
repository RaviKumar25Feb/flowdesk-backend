const express = require("express");
const router = express.Router();

const { ROLES } = require("../constants/roles");

const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validation.middleware");

const {
  assignDevelopersValidation,
} = require("../validations/team.validation");

const {
  assignDevelopers,
  getAssignedDevelopers,
  removeDeveloper,
} = require("../controllers/team.controller");

//assign developer to a project by manager
router.patch(
  "/assign",
  auth,
  authorize(ROLES.MANAGER),
  assignDevelopersValidation,
  validate,
  assignDevelopers,
);

//get assigned developer to a project
router.get(
  "/:projectId/developers",
  auth,
  authorize(ROLES.MANAGER),
  getAssignedDevelopers,
);

//delete developer from a project
router.delete(
  "/:projectId/developers/:developerId",
  auth,
  authorize(ROLES.MANAGER),
  removeDeveloper,
);

module.exports = router;
