const { body } = require("express-validator");

exports.assignDevelopersValidation = [
  body("projectId")
    .notEmpty()
    .withMessage("Project ID is required.")
    .isMongoId()
    .withMessage("Invalid Project ID."),

  body("developers")
    .isArray({ min: 1 })
    .withMessage("Developers must be a non-empty array."),

  body("developers.*").isMongoId().withMessage("Invalid Developer ID."),
];
