const Mongoose = require("mongoose");
const CommentSchema = new Mongoose.Schema({
  location_id: {
    type: String,
  },
  actitivity_date : {
    type: String
  },
  actitivity_name: {
    type: String,
  },
  rating: {
    type: String,
  },
  rating: {
    type: String,
  },
  rating: {
    type: String,
  },
  rating: {
    type: String,
  },
  rating: {
    type: String,
  },
});

const comment = Mongoose.model("comment", CommentSchema);
module.exports = comment;
