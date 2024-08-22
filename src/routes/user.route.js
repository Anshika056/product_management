const  { Router } = require("express");
const router = Router();

const { logging, register } = require("../controllers/user.contoller");

router.post("/register",register);

router.post("/login",logging);

module.exports = router;
