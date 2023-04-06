const { config } = require("dotenv");
const Mongoose = require("mongoose");
require("dotenv").config();

Mongoose.set("strictQuery", false);

const MongoDB = process.env.MOGO_URL;
const connectDB = async () => {
  await Mongoose.connect(MongoDB, {
    useUnifiedTopology: true,
  });
  console.log("MongoDB is Connected!");
};

module.exports = connectDB;
