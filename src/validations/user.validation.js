const { body } = require("express-validator");
const { ROLES } = require("../constants/roles");

//===================== CREATE USER =====================
exports.createUserValidation = [
  body("name")
    .trim()
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ min: 2, max: 50 })
    .withMessage("Name must be between 2 and 50 characters."),

  body("email")
    .trim()
    .notEmpty()
    .withMessage("Email is required.")
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("role")
    .notEmpty()
    .withMessage("Role is required.")
    .isIn([ROLES.DEVELOPER, ROLES.CLIENT])
    .withMessage("Role must be either DEVELOPER or CLIENT."),
];

//===================== UPDATE USER =====================
exports.updateUserValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty."),

  body("email")
    .optional()
    .trim()
    .toLowerCase()
    .isEmail()
    .withMessage("Please enter a valid email."),

  body("isActive")
    .optional()
    .isBoolean()
    .withMessage("isActive must be true or false."),
];
