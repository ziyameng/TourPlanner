const express = require("express");
const { adminAuth } = require("../middleware/auth");
const router = express.Router();
const { register, login, update, deleteUser, getUsers } = require("./Auth");

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/getusers").get(getUsers);
router.route("/update").put(adminAuth, update);
router.route("/delete").delete(adminAuth, deleteUser);

module.exports = router;
