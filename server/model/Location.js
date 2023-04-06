const { Double } = require("mongodb");
const Mongoose = require("mongoose");
const LocationSchema = new Mongoose.Schema({
  coordinates: {
    type: Array,
  },
  category : {
    type: String,
  },
  activityName: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
  },
  creator : {
    type : String,
  },
  age : {
    type : String,
  },
  price : {
    type : Number,
  }
});

const Location = Mongoose.model("location", LocationSchema);
module.exports = Location;
