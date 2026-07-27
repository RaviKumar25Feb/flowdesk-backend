const express = require("express");
const router = express.Router();
const { ROLES } = require("../constants/roles");

const {
  createTask,
  getProjectTasks,
  getTaskById,
  updateTask,
  updateTaskStatus,
  deleteTask,
  getMyTasks,
  getTasks,
} = require("../controllers/task.controller");

const { auth } = require("../middlewares/auth.middleware");
const { authorize } = require("../middlewares/role.middleware");

const { validate } = require("../middlewares/validation.middleware");
const {
  createTaskValidation,
  updateTaskValidation,
  updateTaskStatusValidation,
} = require("../validations/task.validation");

//=========================MANAGER ROUTES===========================
//create task
router.post(
  "/",
  auth,
  authorize(ROLES.MANAGER),
  createTaskValidation,
  validate,
  createTask,
);

//get all tasks for all project
router.get("/", auth, authorize(ROLES.MANAGER), getTasks);

//get all task for a project
router.get(
  "/project/:projectId",
  auth,
  authorize(ROLES.MANAGER),
  getProjectTasks,
);

//update task
router.put(
  "/:taskId",
  auth,
  authorize(ROLES.MANAGER),
  updateTaskValidation,
  validate,
  updateTask,
);

//delete task
router.delete("/:taskId", auth, authorize(ROLES.MANAGER), deleteTask);

//============================DEVELOPER ROUTES======================
//update task status
router.patch(
  "/:taskId/status",
  auth,
  authorize(ROLES.DEVELOPER),
  updateTaskStatusValidation,
  validate,
  updateTaskStatus,
);

//get all assigned tasks
router.get("/my-tasks", auth, authorize(ROLES.DEVELOPER), getMyTasks);

//=======================COMMON ROUTES=======================
//get particular task
router.get("/:taskId", auth, getTaskById);

module.exports = router;
