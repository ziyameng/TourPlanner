const User = require("../model/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const jwtSecret = process.env.jwtSecret;

//Register Funciton
exports.register = async (req, res, next) => {
  const { username, password } = req.body;
  if (password.length < 10) {
    return res
      .status(400)
      .json({ message: "Password is less than 10 character" });
  }
  bcrypt.hash(password, 10).then(async (hash) => {
    await User.create({
      username,
      password: hash,
    })
      .then((user) => {
        const maxAge = 3 * 60 * 60;
        const token = jwt.sign(
          { id: user._id, username, role: user.role },
          jwtSecret,
          { expiresIn: maxAge }
        );

        res.cookie("jwt", token, {
          httpOnly: true,
          maxAge: maxAge * 1000,
        });
        res.status(200).json({
          message: "User successfully created",
          user: user._id,
          token,
        });
      })
      .catch((error) =>
        res.status(401).json({
          message: "User is not successful created",
          error: error.message,
        })
      );
  });
};

//Login Function
exports.login = async (req, res, next) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: "Username or Password is not provided" });
  }
  try {
    const user = await User.findOne({ username });
    if (!user) {
      res
        .status(401)
        .json({ message: "Login is not successful", error: "User not found" });
    } else {
      bcrypt.compare(password, user.password).then(function (result) {
        if (result) {
          const maxAge = 3 * 60 * 60;
          const token = jwt.sign(
            { id: user._id, username, role: user.role },
            jwtSecret,
            { expiresIn: maxAge }
          );

          res.cookie("jwt", token, {
            httpOnly: true,
            maxAge: maxAge * 1000,
          });

          res
            .status(200)
            .json({ message: "Login Successfully", user: user._id, token });
        } else {
          res.status(400).json({ message: "Login not successful" });
        }
      });
    }
  } catch (error) {
    res.status(400).json({
      message: "Error occured",
      error: error.message,
    });
  }
};
