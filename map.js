// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Defining needed variables for user interaction with the map
const markers = [];
const mapContainer = document.getElementById("map");
const tripMapApiKey =
  "5ae2e3f221c38a28845f05b6327f823bbe3325268803cc58e306d9ef";

// Let users submit their own activities to the application
// Store and process these so they can be displayed in the map when called
async function saveCustomLocation() {
  const lat = parseFloat(document.getElementById("user-lat").value);
  const lng = parseFloat(document.getElementById("user-lng").value);
  const coordinates = [lng, lat];
  const activityType = document.getElementById("user-activity").value;
  const name = document.getElementById("activity-name").value;
  const description = document.getElementById("activity-description").value;

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

// Add markers to the Mapbox map, both user locations and OpenTripMap locations
async function addMarkers() {
  // Remove any old markers from the map
  markers.forEach((marker) => marker.remove());

  // Get the values the user added through the user interface inputs
  const lat = parseFloat(document.getElementById("lat").value);
  const lng = parseFloat(document.getElementById("lng").value);
  const radius = parseFloat(document.getElementById("radius").value);
  const activity = document.getElementById("activity").value;

  // Send request to OpenTripMap to get all locations based on search parameters
  const externalResponse = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=${activity}&limit=20&apikey=${tripMapApiKey}`
  );
  const mapData = await externalResponse.json();
  console.log("Map Data: ", mapData);

  // Send request to backend to get all locations based on search parameters
  const userResponse = await fetch("http://localhost:23843/user-locations");
  const userData = await userResponse.json();
  console.log("User Data: ", userData);

  // Defining necessary arrays to store and display information in the map
  let marker;
  const userLocations = [];
  const mapLocations = [];

  // Add locations from OpenTripMap to one array
  for (let i = 0; i < mapData.features.length; i++) {
    mapLocations.push(mapData.features[i]);
  }

  // Display locations from OpenTripMap in the map
  for (const location of mapLocations) {
    const coordinates = location.geometry.coordinates;
    const name = location.properties.name;
    let description = "";

    // Get the short Wikipedia description for the particular location
    const descriptionResponse = await fetch(
      `https://api.opentripmap.com/0.1/en/places/xid/${location.properties.xid}?apikey=${tripMapApiKey}`
    );
    const descriptionData = await descriptionResponse.json();

    // Display Wikipedia description if there is one
    // If no Wikipedia description exists for the location, it is left empty
    if (descriptionData?.wikipedia_extracts) {
      description = descriptionData.wikipedia_extracts.text;
    }

    // Add marker from OpenTripMap to the map display
    // OpenTripMap locations are displayed in red
    marker = new mapboxgl.Marker({ color: "red" })
      .setLngLat(coordinates)
      .addTo(map)
      .setPopup(
        new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${description}`)
      );
    markers.push(marker);
  }

  // Add locations uploaded by users to another array
  userData.forEach((item) => {
    if (item.activity == activity) {
      userLocations.push(item);
    }
  });
  console.log("User locations: ", userLocations);

  // Display locations by users in the map
  for (const location of userLocations) {
    const coordinates = location.coordinates;
    const name = location.name;
    const description = location.description;

    // Add marker from users to the map display
    // User locations are displayed in green
    marker = new mapboxgl.Marker({ color: "green" })
      .setLngLat(coordinates)
      .addTo(map)
      .setPopup(
        new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${description}`)
      );
    markers.push(marker);
  }
  map.setCenter([lng, lat]);
}
