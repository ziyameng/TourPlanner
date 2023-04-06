const Mongoose = require("mongoose");
const LocationSchema = new Mongoose.Schema({
  id: {
    type: String,
  },
  coordinates: {
    type: Array,
  },
  activity: {
    type: String,
  },
  name: {
    type: String,
  },
  description: {
    type: String,
  },
  date: {
    type: String,
  },
});

const Location = Mongoose.model("location", LocationSchema);
module.exports = Location;
