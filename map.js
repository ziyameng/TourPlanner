// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation number: 220024877, OTHER MATRICULATION NUMBERS
// Creating a Holiday Planner

// Initialise the map
function initMap() {
  var options = {
    zoom: 8,
    center: { lat: 56.3398, lng: -2.7967 }, // Positive for North, negative for West
  };
  var map = new google.maps.Map(document.getElementById("map"), options);
}
