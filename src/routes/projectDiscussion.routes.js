const express = require("express");
const router = express.Router();

const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validation.middleware");
const { ROLES } = require("../constants/roles");

const {
  createProjectDiscussionValidation,
  updateProjectDiscussionValidation,
} = require("../validations/projectDiscussion.validation");

const {
  createProjectDiscussion,
  getProjectDiscussions,
  updateProjectDiscussion,
  deleteProjectDiscussion,
} = require("../controllers/projectDiscussion.controller");

// Create Discussion
router.post(
  "/projects/:projectId/discussions",
  auth,
  authorize(ROLES.MANAGER, ROLES.CLIENT),
  createProjectDiscussionValidation,
  validate,
  createProjectDiscussion,
);

// Get Discussions
router.get(
  "/projects/:projectId/discussions",
  auth,
  authorize(ROLES.MANAGER, ROLES.CLIENT),
  getProjectDiscussions,
);

// Update Discussion
router.patch(
  "/project-discussions/:discussionId",
  auth,
  authorize(ROLES.MANAGER, ROLES.CLIENT),
  updateProjectDiscussionValidation,
  validate,
  updateProjectDiscussion,
);

// Delete Discussion
router.delete(
  "/project-discussions/:discussionId",
  auth,
  authorize(ROLES.MANAGER, ROLES.CLIENT),
  deleteProjectDiscussion,
);

module.exports = router;
