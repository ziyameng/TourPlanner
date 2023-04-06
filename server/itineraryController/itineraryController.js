const jwt = require("jsonwebtoken");
const Itinerary = require("./../model/Itinerary");
const { getUserNameFromJWT } = require("./../middleware/auth");

//to store an event for itinerary page
exports.postItinerary = async (req, res) =>{
    const event = req.body;
    //event.actitivity_creator = getUserNameFromJWT(req.cookies.jwt);
    console.log('upload event', event);

  try{
    await Itinerary.create(event);
    res
      .status(200)
      .json({
        success: true,
        message: `Added Event ${event.actitivity_name}`,
      });
  }
  catch (error) {
    res
        .status(500)
        .json({ message: "Error saving event", error: error.message });
  }
};
// to get an event on itinerary page
exports.getItinerary = async(req, res) => {

  try{
    const itineraries = await Itinerary.find({});
    res.status(200).send(itineraries);
  }
  catch(error){
  res
    .status(500)
    .json({ message: "Error fetching events", error: error.message });
  }

}

//to delete an event from itinerary page
exports.deleteItinerary = async(req, res) => {
      const result = req.body;
  try{
    await Itinerary.deleteOne(result);

  }
  catch(error){

  }

};
