const  { Router } = require("express");
const router = Router();
const {authMiddleware} = require("../middleware/auth.middleware")

const { logging, register ,deleteUser ,updateUser } = require("../controllers/user.contoller");

router.post("/register",register);

router.post("/login",logging);

router.put("/updateUser/:id",authMiddleware,updateUser);

router.delete("/deleteUser/:id",authMiddleware,deleteUser);

module.exports = router;
