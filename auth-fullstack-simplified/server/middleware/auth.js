// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation numbers: 220024877, 220033532, 220009855, 220033540, 220031591
// Server Fullstack Authentication: Creating a Holiday Planner

const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

exports.userAuth = (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    jwt.verify(token, jwtSecret, (err, decodedToken) => {
      if (err) {
        return res.status(401).json({ message: "not authorized" });
      } else {
        next();
      }
    });
  } else {
    return res
      .status(401)
      .json({ message: "not authorized, token is not available" });
  }
};
