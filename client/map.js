// Module code: CS5003
// Module: Masters Programming Projects
// Matriculation numbers: 220024877, 220033532, 220009855, 220033540, 220031591
// Homepage: Creating a Holiday Planner

// Defining needed variables for user interaction with the map
const markers = [];
const mapContainer = document.getElementById("map");
const tripMapApiKey =
  "5ae2e3f221c38a28845f05b6327f823bbe3325268803cc58e306d9ef";

// Let users submit their own activities to the application
// Store and process these so they can be displayed in the map when called
async function saveCustomLocation(event) {
  let activityName = document.getElementById("nameSubmissionInput").value;
  let creator = "TEMP"; //This is overwritten later.
  let description = document.getElementById("descriptionSubmissionInput").value;
  let age = document.getElementById("ageSubmissionInput").value;
  let category = document.getElementById("categorySubmissionInput").value;
  let price = document.getElementById("priceSubmissionInput").value;
  let latitude = document.getElementById("latitudeSubmissionInput").value;
  let longitude = document.getElementById("longitudeSubmissionInput").value;
  let postDate = new Date().toLocaleDateString("en-GB");

  // Define the data to be sent to the backend server
  const customLocation = {
    activityName: activityName,
    creator: creator,
    description: description,
    age: age,
    category: category,
    price: price,
    latitude: latitude,
    longitude: longitude,
    postDate: postDate,
  };

  // Send the data for the newly added activity to the backend to be saved
  const response = await fetch("http://localhost:5000/user-locations", {
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
  // Locations users can choose from based on OpenTripMap Places Catalog (OpenTripMap, 2023)
  const externalResponse = await fetch(
    `https://api.opentripmap.com/0.1/en/places/radius?radius=${radius}&lon=${lng}&lat=${lat}&kinds=${activity}&limit=20&apikey=${tripMapApiKey}`
  );
  const mapData = await externalResponse.json();
  console.log("Map Data: ", mapData);

  // Send request to backend to get all locations.
  const userResponse = await fetch("http://localhost:5000/user-locations");
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
    // OpenTripMap locations are displayed in red, based on Mapbox documentation (Mapbox, 2023)
    marker = new mapboxgl.Marker({ color: "indianred" })
      .setLngLat(coordinates)
      .addTo(map)
      .setPopup(
        new mapboxgl.Popup().setHTML(`<h3>${name}</h3><p>${description}</p>`)
      );
    markers.push(marker);
  }

  // Add locations uploaded by users to another array
  userData.forEach((item) => {
    if (item.category == activity) {
      userLocations.push(item);
    }
  });
  console.log("User locations: ", userLocations);

  // Display locations by users in the map
  for (const location of userLocations) {
    const coordinates = location.coordinates;
    const name = location.activityName;
    const description = location.description;
    const radiusKm = radius / 1000;

    // Calculate the distance between user search coordinates and saved location coordinates
    const distance = distanceCoordinatesKm(
      lat,
      lng,
      parseFloat(coordinates[0]),
      parseFloat(coordinates[1])
    );

    if (distance <= radiusKm) {
      // Add marker from users to the map display
      // User locations are displayed in orange, based on Mapbox documentation (Mapbox, 2023)
      marker = new mapboxgl.Marker({ color: "darkorange" })
        .setLngLat([coordinates[1], coordinates[0]])
        .addTo(map)
        .setPopup(
          new mapboxgl.Popup().setHTML(
            `<h3>${name}</h3><p>${description}</p><button name="${location._id}" onclick="activityDetail(this.name)">Detail</button>`
          )
        );
      markers.push(marker);
    }
    map.setCenter([lng, lat]);
  }
  PNLAlgorithm(lat, lng);
}

// Function to calculate distance between user input and saved locations, for a range
// Function for these calculations found in external source (Pons, 2009)
function distanceCoordinatesKm(lat1, lon1, lat2, lon2) {
  var R = 6371;
  var dLat = ((lat2 - lat1) * Math.PI) / 180;
  var dLon = ((lon2 - lon1) * Math.PI) / 180;
  var a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
    Math.cos((lat2 * Math.PI) / 180) *
    Math.sin(dLon / 2) *
    Math.sin(dLon / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  var d = R * c;
  return d;
}

// Function for converting degrees to radians
// Function for these calculations found in external source (W3Resource, 2022)
function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

async function activityDetail(location_id) {
  document.getElementById("activity_dialog").style.display = "block";
  const response = await fetch(
    `http://localhost:5000/user-locations/${location_id}`
  );
  const data = await response.json();
  document.getElementById("activity_name").innerHTML = data.activityName;
  document.getElementById("activity_description").innerHTML = data.description;
  document.getElementById("activity_category").innerHTML = data.category;
  document.getElementById("activity_creator").innerHTML = data.creator;
  document.getElementById("activity_age").innerHTML = data.age;
  document.getElementById("activity_average_price").innerHTML = data.price;

  document.getElementById("submit_comment_btn").name = location_id;

  await refreshActivityDetail(location_id);
}

async function submit_comment(location_id) {
  let comment = document.getElementById("activity_comment_input").value;
  let rating = document.getElementById("activity_comment_rating").value;

  await fetch(`http://localhost:5000/user-comments`, {
    method: "POST",
    body: JSON.stringify({
      location_id: location_id,
      comment: comment,
      rating: rating,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });

  await refreshActivityDetail(location_id);
}

async function refreshActivityDetail(location_id) {
  let results = await fetch(
    `http://localhost:5000/user-comments/${location_id}`
  );
  let comments = await results.json();
  console.log("refresh activity detail", comments);
  let html = "";
  comments.forEach((comment) => {
    star_num = parseInt(comment["rating"]);
    let star_str = "";
    for (let j = 1; j <= 5; j++, star_num--) {
      if (star_num > 0) star_str += "&starf;";
      else star_str += "&star;";
    }
    html +=
      "<div class=comment_box>" +
      star_str +
      "<br><label>" +
      comment["comment"] +
      "</label><br><label>Posted by " +
      comment.author +
      '</label><div style="border:1px solid #CCC"></div></div>';
  });
  document.getElementById("activity_comments").innerHTML = html;
}

function closeActivityDetail() {
  document.getElementById("activity_dialog").style.display = "none";
}
//to store an actitivity to itinerary array in the backend.js
async function addToSchedule(location_id) {
  let actitivity_name = document.getElementById("activity_name").textContent;
  let actitivity_category =
    document.getElementById("activity_category").textContent;
  let actitivity_creator =
    document.getElementById("activity_creator").textContent;
  let activitity_description = document.getElementById(
    "activity_description"
  ).textContent;
  let activitity_age = document.getElementById("activity_age").textContent;
  let activity_average_price = document.getElementById("activity_average_price").textContent;
  let date = document.getElementById("scheduleDate").value;


  console.log(date, location_id,actitivity_name, actitivity_category, actitivity_creator,activitity_description, activitity_age, activity_average_price);


  await fetch(`http://localhost:5000/user-itinerary-post`, {
    method: "POST",
    body: JSON.stringify({
      actitivity_date: date,
      actitivity_name: actitivity_name,
      actitivity_category: actitivity_category,
      actitivity_creator: actitivity_creator,
      activitity_description: activitity_description,
      activitity_age: activitity_age,
      activity_average_price: activity_average_price,
      location_id: location_id,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  });
  const res = await response.json();
  console.log(res);
}

//Filter and Submission Code:

//Popular Near this Activity
//NOT CURRENTLY USED
//Source: https://jsfiddle.net/45c5r246/34/
function PNAAlgorithm(viewedActivity) {
  let recommendedActivityCount = 3;
  let potentialActivities = activityVicinity(viewedActivity, "30000");
  let recommendedActivities = [];

  //Source: https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
  for (let i = 0; i < recommendedActivityCount; i++) {
    let maxRating = Math.max.apply(
      Math,
      potentialActivities.map(function (activity) {
        return getAverageRating(activity);
      })
    );
    let maxRatedActivity = potentialActivities.find(function (activity) {
      return getAverageRating(activity) == maxRating;
    });

    recommendedActivities.push(maxRatedActivity);
    potentialActivities = potentialActivities.filter(
      (activity) => activity.activityName == maxRatedActivity.activityName
    );
  }

  displayRecommendations(recommendedActivities);
}

//Popular Near this Location
//Given coordinates this function will recommend activities a number of activities that are within the given range.
//Source: https://jsfiddle.net/45c5r246/34/
async function PNLAlgorithm(latitude, longitude) {
  let recommendedActivityCount = 4;
  let range = 30000;
  let activities = await getActivities();
  let potentialActivities = filterArea(activities, latitude, longitude, range);
  let recommendedActivities = [];

  if (potentialActivities.length == 0) {
    return;
  } else if (potentialActivities.length < recommendedActivityCount) {
    recommendedActivityCount = potentialActivities.length;
  }

  //Source: https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
  for (let i = 0; i < recommendedActivityCount; i++) {
    let maxRating = Math.max.apply(
      Math,
      potentialActivities.map(function (activity) {
        return getAverageRating(activity);
      })
    );
    let maxRatedActivity = potentialActivities.find(function (activity) {
      return getAverageRating(activity) == maxRating;
    });

    recommendedActivities.push(maxRatedActivity);
    potentialActivities = potentialActivities.filter(
      (activity) => activity.activityName == maxRatedActivity.activityName
    );
  }
  displayRecommendations(recommendedActivities);
}

//Displays the recommendations.
function displayRecommendations(recommendedActivities) {
  if (recommendedActivities == "" | recommendedActivities == null | recommendedActivities == undefined) {
    return;
  }
  //Empties the recommendation result sections if it contains anything.
  let reccommendationResults = document.getElementById(
    "reccommendationResults"
  );
  reccommendationResults.innerHTML = "";

  for (let i = 0; i < recommendedActivities.length; i++) {
    var resultPanel = document.createElement("div");
    resultPanel.className = "resultPanel";

    var resultActivityName = document.createElement("div");
    resultActivityName.id = "resultActivityName";
    resultPanel.className = "detailSubPanel";
    resultActivityName.innerHTML =
      "Activity: " + recommendedActivities[i].activityName;

    var resultActivityDescription = document.createElement("div");
    resultActivityDescription.id = "resultActivityDescription";
    resultPanel.className = "detailSubPanel";
    resultActivityDescription.innerHTML =
      "Description: " + recommendedActivities[i].Description;

    var resultActivityAge = document.createElement("div");
    resultActivityAge.id = "resultActivityAge";
    resultPanel.className = "detailSubPanel";
    resultActivityAge.innerHTML =
      "Appropriate Age: " + recommendedActivities[i].age;

    var resultActivityCategory = document.createElement("div");
    resultActivityCategory.id = "resultActivityCategory";
    resultPanel.className = "detailSubPanel";
    resultActivityCategory.innerHTML =
      "Category: " + recommendedActivities[i].category;

    var resultActivityPrice = document.createElement("div");
    resultActivityPrice.id = "resultActivityPrice";
    resultPanel.className = "detailSubPanel";
    resultActivityPrice.innerHTML =
      "Average Price: £" + recommendedActivities[i].price;

    var resultActivityAuthor = document.createElement("div");
    resultActivityAuthor.id = "resultActivityAuthor";
    resultPanel.className = "detailSubPanel";
    resultActivityAuthor.innerHTML =
      "Author" + recommendedActivities[i].creator;

    resultPanel.appendChild(resultActivityName);
    resultPanel.appendChild(resultActivityDescription);
    resultPanel.appendChild(resultActivityAge);
    resultPanel.appendChild(resultActivityCategory);
    resultPanel.appendChild(resultActivityPrice);
    resultPanel.appendChild(resultActivityAuthor);

    reccommendationResults.appendChild(resultPanel);
  }
}

//Filters all activities by age, category and price. This is called by the filter form in the HTML.
async function filterActivities() {
  let filterResults = await getActivities();

  filterResults = filterArea(
    document.getElementById("latitudeFilterInput").value,
    document.getElementById("longitudeFilterInput").value,
    document.getElementById("rangeFilterInput").value
  );

  filterResults = filterAge(
    filterResults,
    document.getElementById("ageFilterInput").value
  );
  filterResults = filterCategory(
    filterResults,
    document.getElementById("categoryFilterInput").value
  );
  filterResults = filterPrice(
    filterResults,
    document.getElementById("lowerPriceFilterInput").value,
    document.getElementById("upperPriceFilterInput").value
  );

  console.log("Returning Filter Results:");
  console.log(filterResults);
  displayFilteredActivities(filterResults);
}

//Displays the filtered activities.
function displayFilteredActivities(filteredActivities) {
  //Empties the filter result sections if it contains anything.
  let filterResults = document.getElementById("filterResults");
  filterResults.innerHTML = "";

  //Creates a div for each activity, and fills it with divs containing its various properties.
  for (let i = 0; i < filteredActivities.length; i++) {
    var resultPanel = document.createElement("div");
    resultPanel.className = "resultPanel";

    var resultActivityName = document.createElement("div");
    resultActivityName.id = "resultActivityName";
    resultPanel.className = "detailSubPanel";
    resultActivityName.innerHTML =
      "Activity: " + filteredActivities[i].activityName;

    var resultActivityDescription = document.createElement("div");
    resultActivityDescription.id = "resultActivityDescription";
    resultPanel.className = "detailSubPanel";
    resultActivityDescription.innerHTML =
      "Description: " + filteredActivities[i].description;

    var resultActivityAge = document.createElement("div");
    resultActivityAge.id = "resultActivityAge";
    resultPanel.className = "detailSubPanel";
    resultActivityAge.innerHTML = "Age Category: " + filteredActivities[i].age;

    var resultActivityCategory = document.createElement("div");
    resultActivityCategory.id = "resultActivityCategory";
    resultPanel.className = "detailSubPanel";
    resultActivityCategory.innerHTML =
      "Category: " + filteredActivities[i].category;

    var resultActivityPrice = document.createElement("div");
    resultActivityPrice.id = "resultActivityPrice";
    resultPanel.className = "detailSubPanel";
    resultActivityPrice.innerHTML =
      "Average Price: £" + filteredActivities[i].price;

    var resultActivityAuthor = document.createElement("div");
    resultActivityAuthor.id = "resultActivityAuthor";
    resultPanel.className = "detailSubPanel";
    resultActivityAuthor.innerHTML = "Author" + filteredActivities[i].creator;

    resultPanel.appendChild(resultActivityName);
    resultPanel.appendChild(resultActivityDescription);
    resultPanel.appendChild(resultActivityAge);
    resultPanel.appendChild(resultActivityCategory);
    resultPanel.appendChild(resultActivityPrice);
    resultPanel.appendChild(resultActivityAuthor);

    filterResults.appendChild(resultPanel);
  }
}

//Filters activites to ones that exist near the given activity.
async function activityVicinity(viewedActivity, range) {
  let activities = await getActivities();
  activities = activities.filter(
    (activity) => activity.activityName == viewedActivity.activityName
  );
  let potentialActivities = [];

  for (let i = 0; i < activities.length; i++) {
    if (
      getDistance(
        activities[i].latitude,
        activities[i].longitude,
        viewedActivity.latitude,
        viewedActivity.longitude
      ) <= range
    ) {
      potentialActivities.push(activities[i]);
    }
  }

  return potentialActivities;
}

//Filters activites to ones that exist near the given coordinates.
function filterArea(activities, latitude, longitude, range) {
  let potentialActivities = [];

  if ((latitude == "") | (longitude == "") | (range == "")) {
    return potentialActivities;
  } else {
    for (let i = 0; i < activities.length; i++) {
      if (
        distanceCoordinatesKm(
          activities[i].latitude,
          activities[i].longitude,
          latitude,
          longitude
        ) <= (range/1000)
      ) {
        potentialActivities.push(activities[i]);
      }
    }
  }
  return potentialActivities;
}

//Filters activities based on the provided age category.
function filterAge(potentialActivities, givenage) {
  let filteredActivities = [];

  if (givenage == "All") {
    return potentialActivities;
  } else {
    for (let i = 0; i < potentialActivities.length; i++) {
      if (potentialActivities[i].age == givenage) {
        filteredActivities.push(potentialActivities[i]);
      }
    }
    return filteredActivities;
  }
}

//Filters activities based on the provided category.
function filterCategory(potentialActivities, givenCategory) {
  let filteredActivities = [];

  if (givenCategory == "All") {
    return potentialActivities;
  } else {
    for (let i = 0; i < potentialActivities.length; i++) {
      if (potentialActivities[i].category == givenCategory) {
        filteredActivities.push(potentialActivities[i]);
      }
    }
  }

  return filteredActivities;
}

//Filters activities based on the given price range.
function filterPrice(potentialActivities, givenPriceLower, givenPriceUpper) {
  let filteredActivities = [];

  if (givenPriceLower == "" && givenPriceUpper == "") {
    return potentialActivities;
  } else {
    for (let i = 0; i < potentialActivities.length; i++) {
      if (
        potentialActivities[i].price >= givenPriceLower &&
        potentialActivities[i].price <= givenPriceUpper
      ) {
        filteredActivities.push(potentialActivities[i]);
      }
    }
  }

  return filteredActivities;
}

async function getActivities() {
  let response = await fetch("http://localhost:5000/user-locations");
  let data = Object.values(await response.json());
  return data;
}
