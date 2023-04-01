// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Defining needed variables for user interaction with the map
let markers = [];
const mapContainer = document.getElementById("map");
const tripMapApiKey =
  "5ae2e3f221c38a28845f05b6327f823bbe3325268803cc58e306d9ef";

// Let users submit their own activities to the application
// Store and process these so they can be displayed in the map when called
async function saveCustomLocation(event) {
  let lat = parseFloat(document.getElementById("user-lat").value);
  let lng = parseFloat(document.getElementById("user-lng").value);
  let coordinates = [lng, lat];
  let activityType = document.getElementById("user-activity").value;
  let name = document.getElementById("activity-name").value;
  let description = document.getElementById("activity-description").value;

  // Define the data to be sent to the backend server
  const customLocation = {
    coordinates: coordinates,
    activity: activityType,
    name: name,
    description: description,
  };

  // Send the data for the newly added activity to the backend to be saved
  const response = await fetch("http://localhost:23843/user-locations", {
    method: "POST",
    body: JSON.stringify(customLocation),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const data = await response.json();
  console.log(data);
}

// Add markers to the Mapbox map
// The OpenTripMap API is used to get selected activities and their location
async function addMarker(event, customLocation) {
  // Prevent the page from reloading when coordinates are submitted
  event.preventDefault();
  // Get the values the user added through the HTML inputs
  let lat = parseFloat(document.getElementById("lat").value);
  let lng = parseFloat(document.getElementById("lng").value);
  let radius = parseFloat(document.getElementById("radius").value);
  let activity = document.getElementById("activity").value;

  // Send request to OpenTripMap to get all locations based on search parameters
  let externalResponse = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=${activity}&limit=20&apikey=${tripMapApiKey}`
  );
  let data = await externalResponse.json();

  // Send request to backend to get all locations based on search parameters
  let userResponse = await fetch("http://localhost:23843/user-locations");
  let userData = await userResponse.json();

  // Create a new array containing all locations to display on the map
  let locations = [];
  if (userData) {
    locations = customLocation;
  } else {
    locations = data.features;
  }

  // Remove any existing markers before adding new ones
  // Then reset array for storing markers, so it can be used for next search
  markers.forEach((marker) => {
    marker.remove();
  });
  markers = [];

  // Create new marker for each of the results, and add them to the map with a popup for the name
  locations.forEach(async (location) => {
    let coordinates = location.coordinates;
    let name = location.name;
    let activity = location.activity;

    // Send API request to OpenTripMap to get the Wikipedia description for the place
    let descriptionResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/xid/${feature.properties.xid}?apikey=${tripMapApiKey}`
    );
    let descriptionData = await descriptionResponse.json();
    console.log("Description data", descriptionData);

    // Not all places have Wikipedia descriptions, check if it exists first
    // This is done to avoid error if the property is null
    let description = "";
    if (descriptionData?.wikipedia_extracts) {
      location.description = descriptionData.wikipedia_extracts.text;
    }
    if (savedData) {
      description = location.description;
    }

    // Add the markers to the map, showing API markers and custom markers differently
    let marker;
    if (customLocation) {
      marker = new mapboxgl.Marker({ color: "green" });
    } else {
      marker = new mapboxgl.Marker({ color: "red" });
    }
    marker
      .setLngLat(coordinates)
      .addTo(map)
      .setPopup(
        new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${description}`)
      );

    // Add the generates markers to the array for storing them
    markers.push(marker);
  });

  // Center the map on the coordinates provided by the user when they search
  map.setCenter([lng, lat]);
}
