const { body } = require("express-validator");

exports.createTaskCommentValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Comment message is required.")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Comment must be between 2 and 1000 characters."),
];

exports.updateTaskCommentValidation = [
  body("message")
    .trim()
    .notEmpty()
    .withMessage("Comment message is required.")
    .isLength({ min: 2, max: 1000 })
    .withMessage("Comment must be between 2 and 1000 characters."),
];
