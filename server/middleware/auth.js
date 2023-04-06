const jwt = require("jsonwebtoken");
const jwtSecret = process.env.jwtSecret;

// get username from jwt
exports.getUserNameFromJWT = (token) => {
  let username = "";
  jwt.verify(token, jwtSecret, (err, decodedToken) => {
    console.log(decodedToken);
    username = decodedToken.username;
  });
  return username;
};

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

// Check if the user is logged in
exports.isLoggedIn = (req) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      jwt.verify(token, jwtSecret);
      return true;
    } catch (err) {
      return false;
    }
  } else {
    return false;
  }
};
