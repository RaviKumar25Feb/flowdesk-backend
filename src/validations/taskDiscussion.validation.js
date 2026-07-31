const { body } = require("express-validator");

exports.createTaskDiscussionValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Discussion message is required.")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Discussion must be between 2 and 1000 characters."),
];

exports.updateTaskDiscussionValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Discussion message is required.")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Discussion must be between 2 and 1000 characters."),
];
