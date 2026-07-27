const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants/roles");

const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  getArchivedProjects,
  archiveProject,
  restoreProject
} = require("../controllers/project.controller");

const {
  createProjectValidation,
  updateProjectValidation,
} = require("../validations/project.validation");

const { validate } = require("../middlewares/validation.middleware");

// Create Project
router.post(
  "/",
  auth,
  authorize(ROLES.MANAGER),
  createProjectValidation,
  validate,
  createProject,
);

//get all projects for admin
router.get("/", auth, authorize(ROLES.MANAGER), getProjects);

router.get("/archived", auth, authorize(ROLES.MANAGER), getArchivedProjects);

//get single project details only manager
router.get("/:id", auth, authorize(ROLES.MANAGER), getProjectById);

//update project by manager
router.put(
  "/:id",
  auth,
  authorize(ROLES.MANAGER),
  updateProjectValidation,
  validate,
  updateProject,
);

//delete project -> soft delete only archive
router.patch("/:id", auth, authorize(ROLES.MANAGER), archiveProject);
router.patch("/:projectId/restore", auth, authorize(ROLES.MANAGER), restoreProject);

module.exports = router;
