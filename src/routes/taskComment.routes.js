const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants/roles");
const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");
const { validate } = require("../middlewares/validation.middleware");

const {
  createTaskCommentValidation,
  updateTaskCommentValidation,
} = require("../validations/taskComment.validation");

const {
  createTaskComment,
  getTaskComments,
  updateTaskComment,
  deleteTaskComment,
} = require("../controllers/taskComment.controller");

//==================== MANAGER & DEVELOPER ====================
// Get Task Comments
router.get(
  "/:taskId/comments",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  getTaskComments,
);

// Create Comment
router.post(
  "/:taskId/comments",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  createTaskCommentValidation,
  validate,
  createTaskComment,
);

// Update Comment
router.patch(
  "/:commentId",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  updateTaskCommentValidation,
  validate,
  updateTaskComment,
);

// Delete Comment (Soft Delete)
router.delete(
  "/:commentId",
  auth,
  authorize(ROLES.MANAGER, ROLES.DEVELOPER),
  deleteTaskComment,
);

module.exports = router;
