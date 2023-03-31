// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Importing Node.js and Express modules needed
// Cors is imported to allow requests to different domain
var express = require("express");
var cors = require("cors");
var app = express();

// Set up middleware functions in Express to handle incoming requests
app.use(express.urlencoded({ extended: true })); // Allow parsing of extended syntax
app.use(express.json());
app.use(cors());

// Setting up the API port
// If running on school servers use you unique id found by running "id -u."
const API_PORT = 23843;

// Instruct server to listen on port and log out a message, to know program is running as intended
app.listen(API_PORT, () => {
  console.log(`Listening on localhost: ${API_PORT}`);
});
