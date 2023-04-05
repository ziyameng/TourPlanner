// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation numbers: 220024877, 220033532, 220009855, 220033540, 220031591
// Server Fullstack Authentication: Creating a Holiday Planner

const Mongoose = require("mongoose");
const UserSchema = new Mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: true,
  },
  password: {
    type: String,
    minlength: 10,
    required: true,
  },
});

const User = Mongoose.model("user", UserSchema);
module.exports = User;
