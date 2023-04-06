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

const User = Mongoose.model("users", UserSchema);
module.exports = User;
