// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation numbers: 220024877, 220033532, 220009855, 220033540, 220031591
// Server Fullstack Authentication: Creating a Holiday Planner

const express = require("express");
const router = express.Router();
const { register, login } = require("./Auth");

router.route("/register").post(register);
router.route("/login").post(login);

module.exports = router;
