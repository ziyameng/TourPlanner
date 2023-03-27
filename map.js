// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Defining some variables to be accessible
let map;

// Initialise the map, starting position in St Andrews
function initMap() {
  const options = {
    zoom: 14,
    center: { lat: 56.3398, lng: -2.7967 }, // Positive for North, negative for West
  };
  // Create a new map, to add to the application
  map = new google.maps.Map(document.getElementById("map"), options);

  // Add variable for an initial marker to the map
  // Program can add as many markers as desired in this way, but better to use function
  // This is mostly for testing, probably delete before submission
  let marker = new google.maps.Marker({
    position: { lat: 55.953251, lng: -3.188267 }, // Marker for Edinburgh
    map: map,
  });
}

// Function to add markers instead of hardcoding them
function addMarker(event) {
  // Prevent the page from reloading when coordinates are submitted
  event.preventDefault();
  // Get the values the user added through the HTML inputs
  let lat = parseFloat(document.getElementById("lat").value);
  let lng = parseFloat(document.getElementById("lng").value);
  const coordinates = { lat: lat, lng: lng };

  let marker = new google.maps.Marker({
    position: coordinates,
    map: map,
  });
}

// Test data with coordinates for London, delete before submission
// Lat: 51.509865
// Lng: -0.118092
