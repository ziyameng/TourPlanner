// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Function to add markers instead of hardcoding them
function addMarker(event) {
  // Prevent the page from reloading when coordinates are submitted
  event.preventDefault();
  // Get the values the user added through the HTML inputs
  let lat = parseFloat(document.getElementById("lat").value);
  let lng = parseFloat(document.getElementById("lng").value);
  let radius = parseFloat(document.getElementById("radius").value);
  let activity = document.getElementById("activity").value;

  let marker = new mapboxgl.Marker().setLngLat([lng, lat]).addTo(map);
}

// Test data with coordinates for London, delete before submission
// Lat: 51.509865
// Lng: -0.118092
