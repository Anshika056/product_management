const { check } = require("express-validator");

const registerValidationRules = [
  check("username").notEmpty().withMessage("Username is required"),
  check("email").isEmail().withMessage("Please provide a valid email"),
  check("password")
    .isLength({ min: 6 })
    .withMessage("Password must be at least 6 characters long"),
];

const loginValidationRules = [
  check("email").isEmail().withMessage("Please provide a valid email"),
  check("password").notEmpty().withMessage("Password is required"),
];

const deleteUserValidationRules = [
  check("id").isMongoId().withMessage("Invalid user ID"),
];
module.exports = {
  registerValidationRules,
  loginValidationRules,
  deleteUserValidationRules,
};
