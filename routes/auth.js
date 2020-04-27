const express = require("express");
const router = express.Router();

const { login, postLogin, logout, register, postRegister } = require("../controllers/auth");

const validations = require("../validations/auth");

// Login
router.get("/login", login);

router.post("/login", validations.login, postLogin);

// Register
router.get("/register", register);

router.post("/register", validations.register, postRegister);

module.exports = router;
