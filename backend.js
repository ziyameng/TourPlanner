// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Importing Node.js and Express modules needed
// Cors is imported to allow requests to different domain
var express = require("express");
var cors = require("cors");
// var mongoose = require("mongoose");
var app = express();

// Connect database through mongodb client 
const { MongoClient } = require("mongodb")
const uri = "mongodb://127.0.0.1"
const client = new MongoClient(uri);
const db = client.db('default')

// Set up middleware functions in Express to handle incoming requests
app.use(express.urlencoded({ extended: true })); // Allow parsing of extended syntax
app.use(express.json());
app.use(cors());

// Setting up the API port
// If running on school servers use you unique id found by running "id -u."
const API_PORT = 23843;

// Defining variable to store created locations
// For testing, will use database later
let customLocations = [];

// ======== Frontend endpoints ========
// Linked homepage to frontend.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/frontend.html");
});

// Linked itinerary page to itinerary.html
app.get("/myPage", function (req, res) {
  res.sendFile(__dirname + "/myPage.html");
});

// Added endpoint to link to frontend.js from server
app.get("/map.js", function (req, res) {
  res.sendFile(__dirname + "/map.js");
});

// Added endpoint to link to frontend.css from server
app.get("/style.css", function (req, res) {
  res.sendFile(__dirname + "/style.css");
});

// Linked to itinerary.html
app.get("/myPage.html", function (req, res) {
  res.sendFile(__dirname + "/myPage.html");
});

// Added endpoint to link to itinerary.js from server
app.get("/myPage.js", function (req, res) {
  res.sendFile(__dirname + "/myPage.js");
});

// Added endpoint to link to itinerary.css from server
app.get("/myPage.css", function (req, res) {
  res.sendFile(__dirname + "/myPage.css");
});

// Endpoint to get the user locations
app.get("/user-locations", async (req, res) => {
  // res.send(customLocations);

  const location_collection = db.collection('location');
  let results = []

  let cursor = location_collection.find({})

  await cursor.forEach((item) => results.push(item))

  res.status(200).send(results)
});

// ======== Backend endpoints ========
// Endpoint to receive custom locations data from frontend
app.post("/user-locations", async function (req, res) {
  const location_collection = db.collection('location');
  const customLocation = req.body;

  // customLocations.push(customLocation);
  await location_collection.insertOne(customLocation)

  res
    .status(200)
    .json({ success: true, message: `Added Location ${customLocation.name}` });
});

// To delete any custom location data from myPage page
app.post("/user-locations-delete", function (req, res) {
  const location_collection = db.collection('location');
  let deleteId = req.body;

  console.log("delete id: ", deleteId.postIdToDelete);
  let matchId = deleteId.postIdToDelete;

  location_collection.deleteOne({ 'id' : matchId })
  /*for (let i in customLocations) {
    if (customLocations[i].id === matchId) {
      customLocations.splice(i, 1);
    } else {
      continue;
    }
  }*/
});

// clear all collections in db (for test)
async function deleteAllDataInCollection() {
  const location_collection = db.collection('location')
  const activity_collection = db.collection('activity')
  const comment_collection = db.collection('comment')

  await location_collection.deleteMany({})
  await activity_collection.deleteMany({})
  await comment_collection.deleteMany({})
}

// call this api for clear db (for test)
app.get('/cleardb', async (req, res) => {
  await deleteAllDataInCollection()
  res.send('clear collections')
})


// Instruct server to listen on port and log out a message, to know program is running as intended
app.listen(API_PORT, () => {
  console.log(`Listening on localhost: ${API_PORT}`);
});
