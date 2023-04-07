const Mongoose = require("mongoose");
const ItinerarySchema = new Mongoose.Schema({
  location_id: {
    type: String,
  },
  actitivity_date : {
    type: String
  },
  actitivity_name: {
    type: String,
  },
  actitivity_category: {
    type: String,
  },
  actitivity_creator: {
    type: String,
  },
  activitity_age: {
    type: String,
  },
  activity_average_price: {
    type: Number,
  },
});

const Itinerary = Mongoose.model("Itinerary", ItinerarySchema);
module.exports = Itinerary;
