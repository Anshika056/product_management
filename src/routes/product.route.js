const { Router } = require("express");
const router = Router();
const {
  authMiddleware,
  adminAuthenticated,
} = require("../middleware/auth.middleware");

const {
  addProduct,
  getProducts,
  updateProductVisibility,
} = require("../controllers/product.controller");

router.post("/addProduct", authMiddleware, addProduct);

router.get("/getProducts", authMiddleware, getProducts);

router.put(
  "/updateProductVisibility",
  authMiddleware,
  adminAuthenticated,
  updateProductVisibility
);

module.exports = router;

