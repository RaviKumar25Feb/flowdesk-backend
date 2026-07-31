const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants/roles");
const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validation.middleware");

const {
  createTaskDiscussionValidation,
  updateTaskDiscussionValidation,
} = require("../validations/taskDiscussion.validation");

const {
  createTaskDiscussion,
  getTaskDiscussions,
  updateTaskDiscussion,
  deleteTaskDiscussion,
} = require("../controllers/taskDiscussion.controller");

//==================== MANAGER & DEVELOPER ====================
// Get Task Discussions
router.get(
  "/:discussionId/discussions",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  getTaskDiscussions,
);

// Create Discussion
router.post(
  "/:discussionId/discussions",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  createTaskDiscussionValidation,
  validate,
  createTaskDiscussion,
);

// Update Discussion
router.patch(
  "/:discussionId",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  updateTaskDiscussionValidation,
  validate,
  updateTaskDiscussion,
);

// Delete Discussion (Soft Delete)
router.delete(
  "/:discussionId",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  deleteTaskDiscussion,
);

module.exports = router;
