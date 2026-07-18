const { body } = require("express-validator");

exports.createProjectDiscussionValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Discussion message is required.")
    .isLength({ min: 2, max: 2000 })
    .withMessage("Discussion message must be between 2 and 2000 characters."),
];

exports.updateProjectDiscussionValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Discussion message is required.")
    .isLength({ min: 2, max: 2000 })
    .withMessage("Discussion message must be between 2 and 2000 characters."),
];
