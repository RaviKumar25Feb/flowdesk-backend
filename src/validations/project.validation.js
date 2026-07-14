const { body } = require("express-validator");
const { PROJECT_PRIORITY } = require("../constants/project.constants");
const { PROJECT_STATUS } = require("../constants/project.constants");

const createProjectValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Project name is required")
    .isLength({ min: 3, max: 100 })
    .withMessage("Project name must be between 3 and 100 characters"),

  body("description")
    .trim()
    .notEmpty()
    .withMessage("Project description is required")
    .isLength({ max: 2000 })
    .withMessage("Project description cannot exceed 2000 characters"),

  body("client")
    .notEmpty()
    .withMessage("Client is required")
    .isMongoId()
    .withMessage("Invalid client id"),

  body("priority")
    .optional()
    .isIn(Object.values(PROJECT_PRIORITY))
    .withMessage("Invalid project priority"),

  body("startDate").optional().isISO8601().withMessage("Invalid start date"),

  body("deadline")
    .optional()
    .isISO8601()
    .withMessage("Invalid deadline date")
    .custom((deadline, { req }) => {
      if (
        req.body.startDate &&
        new Date(deadline) <= new Date(req.body.startDate)
      ) {
        throw new Error("Deadline must be after start date");
      }

      return true;
    }),
];

const updateProjectValidation = [
  body("name").optional().trim().notEmpty(),

  body("description").optional().trim().notEmpty(),

  body("priority").optional().isIn(Object.values(PROJECT_PRIORITY)),

  body("status").optional().isIn(Object.values(PROJECT_STATUS)),

  body("startDate").optional().isISO8601(),

  body("deadline").optional().isISO8601(),
];

module.exports = {
  createProjectValidation,
  updateProjectValidation,
};
