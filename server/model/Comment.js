const Mongoose = require("mongoose");
const CommentSchema = new Mongoose.Schema({
  location_id: {
    type: String,
  },
  author : {
    type: String
  },
  comment: {
    type: String,
  },
  rating: {
    type: String,
  },
});

const comment = Mongoose.model("comment", CommentSchema);
module.exports = comment;
