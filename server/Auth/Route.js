const express = require("express");
const router = express.Router();
const { register, login, getUsernameFromJWT } = require("./Auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/username").post(getUsernameFromJWT);

module.exports = router;
