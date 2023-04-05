// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation numbers: 220024877, 220033532, 220009855, 220033540, 220031591
// Server Fullstack Authentication: Creating a Holiday Planner

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
