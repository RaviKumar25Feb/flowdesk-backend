const express = require("express");
const router = express.Router();

const { ROLES } = require("../constants/roles");

const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validation.middleware");

const {
  createProject,
  getProjects,
  getProjectById,
  updateProject,
  getArchivedProjects,
  archiveProject,
  restoreProject,
  getProjectOptions,
} = require("../controllers/project.controller");

const {
  createProjectValidation,
  updateProjectValidation,
} = require("../validations/project.validation");

// Create project
router.post(
  "/",
  auth,
  authorize(ROLES.MANAGER),
  createProjectValidation,
  validate,
  createProject,
);

// Get all projects
router.get("/", auth, authorize(ROLES.MANAGER), getProjects);

// Get lightweight project options
router.get("/options", auth, authorize(ROLES.MANAGER), getProjectOptions);

// Get archived projects
router.get("/archived", auth, authorize(ROLES.MANAGER), getArchivedProjects);

// Restore project
router.patch(
  "/:projectId/restore",
  auth,
  authorize(ROLES.MANAGER),
  restoreProject,
);

// Get single project
router.get("/:id", auth, authorize(ROLES.MANAGER), getProjectById);

// Update project
router.put(
  "/:id",
  auth,
  authorize(ROLES.MANAGER),
  updateProjectValidation,
  validate,
  updateProject,
);

// Archive project
router.patch("/:id", auth, authorize(ROLES.MANAGER), archiveProject);

module.exports = router;
