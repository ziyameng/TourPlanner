// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation numbers: 220024877, 220033532, 220009855, 220033540, 220031591
// Backend: Creating a Holiday Planner

// Importing Node.js and Express modules needed
// Cors is imported to allow requests to different domain
var express = require("express");
var cors = require("cors");
// var mongoose = require("mongoose");
var app = express();

// Connect database through mongodb client
const { MongoClient } = require("mongodb");
const uri = "mongodb://127.0.0.1";
const client = new MongoClient(uri);
const db = client.db("default");

// Set up middleware functions in Express to handle incoming requests
app.use(express.urlencoded({ extended: true })); // Allow parsing of extended syntax
app.use(express.json());
app.use(cors());

// Setting up the API port
// If running on school servers use you unique id found by running "id -u."
const API_PORT = 23843;

// ======== Frontend endpoints ========
// Link homepage to frontend.html
app.get("/", function (req, res) {
  res.sendFile(__dirname + "/frontend.html");
});

// Add endpoint to link to frontend.js from server
app.get("/map.js", function (req, res) {
  res.sendFile(__dirname + "/map.js");
});

// Add endpoint to link to frontend.css from server
app.get("/style.css", function (req, res) {
  res.sendFile(__dirname + "/style.css");
});

// ======== API endpoints for MyPage ========
// Link myPage to myPage.html
app.get("/myPage", function (req, res) {
  res.sendFile(__dirname + "/myPage.html");
});

// Link myPage to myPage.html
app.get("/myPage.html", function (req, res) {
  res.sendFile(__dirname + "/myPage.html");
});

// Add endpoint to link to myPage.js from server
app.get("/myPage.js", function (req, res) {
  res.sendFile(__dirname + "/myPage.js");
});

// Add endpoint to link to myPage.css from server
app.get("/myPage.css", function (req, res) {
  res.sendFile(__dirname + "/myPage.css");
});

// ======== API endpoints for Comments ========
// Add endpoint to get user comments based on location ID
app.get("/user-comments/:LOCATION_ID", async (req, res) => {
  const comment_collection = db.collection("comment");

  let results = [];

  let cursor = comment_collection.find({ location_id: req.params.LOCATION_ID });

  await cursor.forEach((item) => results.push(item));

  res.status(200).send(results);
});

// Add endpoint to save user comments to database
app.post("/user-comments", async (req, res) => {
  const comment_collection = db.collection("comment");

  let comment = req.body;

  let results = await comment_collection.insertOne(comment);

  res.status(200).send("Add comment" + comment);
});

// ======== API endpoints for User Locations ========
// Add endpoint to get user locations
app.get("/user-locations", async (req, res) => {
  const location_collection = db.collection("location");
  let results = [];

  let cursor = location_collection.find({});

  await cursor.forEach((item) => results.push(item));

  res.status(200).send(results);
});

// Add endpoint to get user locations based on location ID
app.get("/user-locations/:LOCATION_ID", async (req, res) => {
  const location_collection = db.collection("location");
  let results = [];

  let cursor = location_collection.find({ id: req.params.LOCATION_ID });

  await cursor.forEach((item) => results.push(item));

  if (results.length == 0) res.status(400).send("Failed to find the location");
  else res.status(200).send(results[0]);
});

// Add endpoint to save user locations to database
app.post("/user-locations", async function (req, res) {
  const location_collection = db.collection("location");
  const customLocation = req.body;

  // customLocations.push(customLocation);
  await location_collection.insertOne(customLocation);

  res
    .status(200)
    .json({ success: true, message: `Added Location ${customLocation.name}` });
});

// Add endpoint to delete user locations from database
app.post("/user-locations-delete", function (req, res) {
  const location_collection = db.collection("location");
  let deleteId = req.body;

  console.log("delete id: ", deleteId.postIdToDelete);
  let matchId = deleteId.postIdToDelete;

  location_collection.deleteOne({ id: matchId });
  /*for (let i in customLocations) {
    if (customLocations[i].id === matchId) {
      customLocations.splice(i, 1);
    } else {
      continue;
    }
  }*/
});

// Clear all collections in db (for test)
async function deleteAllDataInCollection() {
  const location_collection = db.collection("location");
  const activity_collection = db.collection("activity");
  const comment_collection = db.collection("comment");

  await location_collection.deleteMany({});
  await activity_collection.deleteMany({});
  await comment_collection.deleteMany({});
}

// Call this API for clear db (for test)
app.get("/cleardb", async (req, res) => {
  await deleteAllDataInCollection();
  res.send("clear collections");
});

// Instruct server to listen on port and log out a message, to know program is running as intended
app.listen(API_PORT, () => {
  console.log(`Listening on localhost: ${API_PORT}`);
});
