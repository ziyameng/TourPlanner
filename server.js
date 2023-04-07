// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation numbers: 220024877, 220033532, 220009855, 220033540, 220031591
// Server: Creating a Holiday Planner

const express = require("express");
const cors = require("cors");

const path = require("path");
const cookieParser = require("cookie-parser");
const connectDB = require("./server/config/database");
const { userAuth, isLoggedIn } = require("./server/middleware/auth");
const {
  getUserComments,
  postUserComments,
} = require("./server/controller/commentController");
const {
  getUserLocations,
  getLocationById,
  postUserLocations,
  deleteUserLocations,
} = require("./server/controller/locationController");

const {
  postItinerary,
  getItinerary,
} = require("./server/itineraryController/itineraryController");

const app = express();

require("dotenv").config();

app.use(express.json());
app.use("/api/auth", require("./server/Auth/Route"));
app.use(cookieParser());

// Set up middleware functions in Express to handle incoming requests
app.use(express.urlencoded({ extended: true })); // Allow parsing of extended syntax
app.use(express.json());
app.use(cors());

// Add endpoints for Comments and Locations
app.get("/user-comments/:LOCATION_ID", getUserComments);
// add auth
app.post("/user-comments", userAuth, postUserComments);
app.get("/user-locations", getUserLocations);
app.get("/user-locations/:LOCATION_ID", getLocationById);
// add auth
app.post("/user-locations", userAuth, postUserLocations);
app.post("/user-locations-delete", deleteUserLocations);
//add an event to itinerary pg
app.post("/user-itinerary-post", postItinerary);
app.get("/user-itinerary-get", getItinerary);
//delete an event to itinerary pg

// Other existing routes
app.get("/basic", userAuth, (req, res) => res.send("User Route"));

app.get("/home", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "home.html"))
);
app.get("/register", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "register.html"))
);
app.get("/login", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "login.html"))
);

app.get("/logout", (req, res) => {
  res.cookie("jwt", "", { maxAge: "1" });
  res.redirect("/");
});

//
app.get("/isLoggedIn", (req, res) => {
  const loggedIn = isLoggedIn(req);
  if (loggedIn) {
    res.json({ loggedIn, jwt: req.cookies.jwt });
  } else {
    res.json({ loggedIn });
  }
});

connectDB();

const PORT = process.env.PORT;

const server = app.listen(PORT, () =>
  console.log(`server is successfully running at ${PORT} `)
);

process.on("unhandledRejection", (err) => {
  console.log(`error occured: ${err.message}`);
  server.close(() => process.exit(1));
});

//// ======== Frontend endpoints ========
// Link homepage to frontend.html
app.get("/", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "frontend.html"))
);

// Add endpoint to link to frontend.js from server
app.get("/map.js", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "map.js"))
);

// Add endpoint to link to frontend.css from server
app.get("/style.css", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "style.css"))
);

// ======== API endpoints for MyPage ========
// Link myPage to myPage.html
app.get("/myPage", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "/myPage.html"))
);

app.get("/myPage.js", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "/myPage.js"))
);

app.get("/myPage.css", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "/myPage.css"))
);
//======== API endpoints for Itinerary Page ========
app.get("/itinerary", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "/itinerary.html"))
);

app.get("/itinerary.js", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "/itinerary.js"))
);

app.get("/itinerary.css", (req, res) =>
  res.sendFile(path.join(__dirname, "client", "/itinerary.css"))
);
