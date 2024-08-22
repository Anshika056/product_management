const { Router } = require("express");
const router = Router();
const { authMiddleware, roleGuard } = require("../middleware/auth.middleware");

const {
  logging,
  register,
  deleteUser,
  updateUser,
} = require("../controllers/user.contoller");
const {
  registerValidationRules,
  loginValidationRules,
  deleteUserValidationRules,
} = require("../validation/user.schema");

router.post("/register", registerValidationRules, register);

router.post("/login",loginValidationRules,  logging);

router.put(
  "/updateUser/:id",
  authMiddleware,
  roleGuard(["user", "admin"]),
  updateUser
);

router.delete(
  "/deleteUser/:id",
  authMiddleware,
  roleGuard(["user", "admin"]),
  deleteUserValidationRules,
  deleteUser
);

module.exports = router;
