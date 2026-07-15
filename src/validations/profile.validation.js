const { body } = require("express-validator");

exports.updateProfileValidation = [
  body("name")
    .optional()
    .trim()
    .notEmpty()
    .withMessage("Name cannot be empty")
    .isLength({ min: 3, max: 50 })
    .withMessage("Name must be between 3 and 50 characters"),

  body("phone")
    .optional()
    .isMobilePhone()
    .withMessage("Please provide a valid phone number"),

  body("bio")
    .optional()
    .trim()
    .isLength({ max: 500 })
    .withMessage("Bio cannot exceed 500 characters"),

  body("dateOfBirth")
    .optional()
    .isISO8601()
    .withMessage("Invalid date of birth"),

  body("gender")
    .optional()
    .isIn(["Male", "Female", "Other"])
    .withMessage("Invalid gender"),

  body("address").optional().trim(),

  body("city").optional().trim(),

  body("state").optional().trim(),

  body("country").optional().trim(),

  body("pincode").optional().trim(),

  body("github").optional().isURL().withMessage("Invalid GitHub URL"),

  body("linkedin").optional().isURL().withMessage("Invalid LinkedIn URL"),

  body("portfolio").optional().isURL().withMessage("Invalid Portfolio URL"),

  body("designation").optional().trim(),

  body("department").optional().trim(),

  body("skills").optional().isArray().withMessage("Skills must be an array"),
];
