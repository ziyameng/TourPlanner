const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { adminAuth, userAuth } = require("./middleware/auth");
const app = express();
require("dotenv").config();

app.use(express.json());
app.use("/api/auth", require("./Auth/Route"));
app.use(cookieParser());

app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "home.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "register.html"))
);
app.get("/getusers", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "user.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "views", "login.html"))
);
app.get("/admin", adminAuth, (req, res) =>
  res.sendFile(path.join(__dirname, "views", "admin.html"))
);
app.get("/basic", userAuth, (req, res) =>
  res.sendFile(path.join(__dirname, "views", "user.html"))
);

connectDB();

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`server is successfully running at ${PORT} `)
);

process.on("unhandledRejection", (err) => {
  console.log(`error occured: ${err.message}`);
  server.close(() => process.exit(1));
});
