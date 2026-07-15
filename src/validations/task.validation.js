const { body } = require("express-validator");

exports.createTaskValidation = [
  body("title")
    .notEmpty()
    .withMessage("Task title is required.")
    .isLength({ max: 100 })
    .withMessage("Task title cannot exceed 100 characters."),

  body("project")
    .notEmpty()
    .withMessage("Project ID is required.")
    .isMongoId()
    .withMessage("Invalid Project ID."),

  body("assignedTo")
    .notEmpty()
    .withMessage("Assigned Developer is required.")
    .isMongoId()
    .withMessage("Invalid Developer ID."),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .withMessage("Invalid priority."),

  body("startDate").optional().isISO8601().withMessage("Invalid start date."),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date."),

  body("estimatedHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated hours must be a positive number."),
];

exports.updateTaskValidation = [
  body("title")
    .optional()
    .isLength({ max: 100 })
    .withMessage("Task title cannot exceed 100 characters."),

  body("project").optional().isMongoId().withMessage("Invalid Project ID."),

  body("assignedTo")
    .optional()
    .isMongoId()
    .withMessage("Invalid Developer ID."),

  body("priority")
    .optional()
    .isIn(["LOW", "MEDIUM", "HIGH", "CRITICAL"])
    .withMessage("Invalid priority."),

  body("status")
    .optional()
    .isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"])
    .withMessage("Invalid task status."),

  body("startDate").optional().isISO8601().withMessage("Invalid start date."),

  body("dueDate").optional().isISO8601().withMessage("Invalid due date."),

  body("estimatedHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Estimated hours must be a positive number."),

  body("actualHours")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Actual hours must be a positive number."),
];

exports.updateTaskStatusValidation = [
  body("status")
    .notEmpty()
    .withMessage("Task status is required.")
    .isIn(["TODO", "IN_PROGRESS", "IN_REVIEW", "COMPLETED"])
    .withMessage("Invalid task status."),
];
