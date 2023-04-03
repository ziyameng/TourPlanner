const express = require("express");
const cookieParser = require("cookie-parser");
const connectDB = require("./config/database");
const { adminAuth, userAuth } = require("./middleware/auth");
connectDB();
const app = express();
require("dotenv").config();

app.use(express.json());
//Import Middleware
app.use("/api/auth", require("./Auth/Route"));
app.use(cookieParser());

app.get("/admin", adminAuth, (req, res) => res.send("Admin Route"));
app.get("/basic", userAuth, (req, res) => res.send("User Route"));
const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`server is successfully running at ${PORT} `)
);

process.on("unhandledRejection", (err) => {
  console.log(`error occured: ${err.message}`);
  server.close(() => process.exit(1));
});
