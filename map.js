// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Defining needed variables for user interaction with the map
const mapContainer = document.getElementById("map");
const tripMapApiKey =
  "5ae2e3f221c38a28845f05b6327f823bbe3325268803cc58e306d9ef";

// Add markers to the Mapbox map
// The OpenTripMap API is used to get selected activities and their location
async function addMarker(event) {
  // Prevent the page from reloading when coordinates are submitted
  event.preventDefault();
  // Get the values the user added through the HTML inputs
  let lat = parseFloat(document.getElementById("lat").value);
  let lng = parseFloat(document.getElementById("lng").value);
  let radius = parseFloat(document.getElementById("radius").value);
  let activity = document.getElementById("activity").value;

  // Send API request to OpenTripMap to get all places based on radius
  let response = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=${activity}&limit=20&apikey=${tripMapApiKey}`
  );
  let data = await response.json();

  // Create new marker for each of the results, and add them to the map with a popup for the name
  data.features.forEach((feature) => {
    console.log(data);
    let coordinates = feature.geometry.coordinates;
    let name = feature.properties.name;

    let marker = new mapboxgl.Marker()
      .setLngLat(coordinates)
      .addTo(map)
      .setPopup(new mapboxgl.Popup().setHTML(`<h3>${name}</h3>`));
  });
  // Center the map on the coordinates provided by the user when they search
  map.setCenter([lng, lat]);
}
