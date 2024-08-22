const { check, param } = require("express-validator");

const addProductValidationRules = [
  check("name").notEmpty().withMessage("Name is required"),
  check("description").notEmpty().withMessage("Description is required"),
  check("price")
    .notEmpty()
    .withMessage("Price is required")
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
];

const updateProductVisibilityValidationRules = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

const updateProductValidationRules = [
  param("id").isMongoId().withMessage("Invalid product ID"),
  check("name").optional().notEmpty().withMessage("Name cannot be empty"),
  check("description")
    .optional()
    .notEmpty()
    .withMessage("Description cannot be empty"),
  check("price")
    .optional()
    .isFloat({ gt: 0 })
    .withMessage("Price must be a positive number"),
];

const deleteProductValidationRules = [
  param("id").isMongoId().withMessage("Invalid product ID"),
];

module.exports = {
    deleteProductValidationRules,
    updateProductValidationRules,
    updateProductVisibilityValidationRules,
    addProductValidationRules
}