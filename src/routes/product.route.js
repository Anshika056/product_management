const { Router } = require("express");
const router = Router();
const { authMiddleware, roleGuard } = require("../middleware/auth.middleware");

const {
  addProduct,
  getProducts,
  updateProductVisibility,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller");

const {
  deleteProductValidationRules,
  updateProductValidationRules,
  updateProductVisibilityValidationRules,
  addProductValidationRules,
} = require("../validation/product.schema");


router.post(
  "/addProduct",
  authMiddleware,
  roleGuard(["admin", "user"]),
  addProductValidationRules,
  addProduct
);

router.get("/getProducts", authMiddleware, getProducts);

router.put(
  "/updateProductVisibility/:id",
  authMiddleware,
  roleGuard(["admin"]),
  updateProductVisibilityValidationRules,
  updateProductVisibility
);

router.put(
  "/updateProduct/:id",
  authMiddleware,
  roleGuard(["admin", "user"]),
  updateProductValidationRules,
  updateProduct
);

router.delete(
  "/deleteProduct/:id",
  authMiddleware,
  roleGuard(["admin", "user"]),
  deleteProductValidationRules,
  deleteProduct
);

module.exports = router;
