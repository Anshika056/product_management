const { Router } = require("express");
const router = Router();
const {
  authMiddleware,
  roleGuard,
} = require("../middleware/auth.middleware");

const {
  addProduct,
  getProducts,
  updateProductVisibility,
  updateProduct,
  deleteProduct
} = require("../controllers/product.controller");

router.post("/addProduct", authMiddleware,roleGuard(["admin","user"]), addProduct);

router.get("/getProducts", authMiddleware, getProducts);

router.put(
  "/updateProductVisibility/:id",
  authMiddleware,
  roleGuard(["admin"]),
  updateProductVisibility
);

router.put("/updateProduct/:id", authMiddleware,roleGuard(["admin","user"]), updateProduct);

router.delete("/deleteProduct/:id", authMiddleware,roleGuard(["admin","user"]), deleteProduct);


module.exports = router;


