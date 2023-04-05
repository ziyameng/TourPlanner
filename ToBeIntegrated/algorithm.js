const activityArray = [
    { activityName: "Activity One", description: "it was okay", age: "All", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Two", description: "eh", age: "All", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Three", description: "no too bad", age: "Elder", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Four", description: "Would go again", age: "Young", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Five", description: "Never again", age: "Adult", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Six", description: "I'm tired", age: "Adult", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Seven", description: "One giant potato", age: "Adult", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Eight", description: "CS5003 Flashbacks", age: "Young", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Nine", description: "Pork pie", age: "Elder", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
    { activityName: "Activity Ten", description: "blah blah blah", age: "All", category: "accomodations", price: 10, latitude: 17, longitude: 10 },
];

const reviewArray = [
    { parentActivityName: "Activity One", author: "Samuel", rating: "1", comment: "It was not very good." },
    { parentActivityName: "Activity One", author: "Bob", rating: "4", comment: "I Liked it." },
    { parentActivityName: "Activity Two", author: "Dave", rating: "3", comment: "Mediocre" },
    { parentActivityName: "Activity three", author: "Dave", rating: "2", comment: "Mediocre" },
];

//Popular Near this Activity
//Source: https://jsfiddle.net/45c5r246/34/
function PNAAlgorithm(viewedActivity) {
    let recommendedActivityCount = 3;
    let potentialActivities = activityVicinity(viewedActivity, "30000");
    let recommendedActivities = [];

    //Source: https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
    for (let i = 0; i < recommendedActivityCount; i++) {
        let maxRating = Math.max.apply(Math, potentialActivities.map(function (activity) { return getAverageRating(activity); }))
        let maxRatedActivity = potentialActivities.find(function (activity) { return getAverageRating(activity) == maxRating; })

        recommendedActivities.push(maxRatedActivity);
        potentialActivities = potentialActivities.filter(activity => activity.activityName == maxRatedActivity.activityName);
    }

    return recommendedActivities;
}

//Popular Near this Location
//Source: https://jsfiddle.net/45c5r246/34/
function PNLAlgorithm(latitude, longitude) {
    let recommendedActivityCount = 3;
    let potentialActivities = filterArea(latitude, longitude, "30000");
    let recommendedActivities = [];

    //Source: https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
    for (let i = 0; i < recommendedActivityCount; i++) {
        let maxRating = Math.max.apply(Math, potentialActivities.map(function (activity) { return getAverageRating(activity); }))
        let maxRatedActivity = potentialActivities.find(function (activity) { return getAverageRating(activity) == maxRating; })

        recommendedActivities.push(maxRatedActivity);
        potentialActivities = potentialActivities.filter(activity => activity.activityName == maxRatedActivity.activityName);
    }

    return recommendedActivities;
}

function displayRecommendations(recommendedActivities) {
    let reccommendationResults = document.getElementById("reccommendationResults");
    reccommendationResults.innerHTML = "";

    for (let i = 0; i < recommendedActivities.length; i++) {
        var resultPanel = document.createElement("div");
        resultPanel.className = "resultPanel";

        var resultActivityName = document.createElement("div");
        resultActivityName.id = "resultActivityName";
        resultPanel.className = "detailSubPanel";
        resultActivityName.innerHTML = "Activity: " + recommendedActivities[i].activityName;

        var resultActivityDescription = document.createElement("div");
        resultActivityDescription.id = "resultActivityDescription";
        resultPanel.className = "detailSubPanel";
        resultActivityDescription.innerHTML = "Description: " + recommendedActivities[i].Description;

        var resultActivityAge = document.createElement("div");
        resultActivityAge.id = "resultActivityAge";
        resultPanel.className = "detailSubPanel";
        resultActivityAge.innerHTML = "Appropriate Age: " + recommendedActivities[i].age;

        var resultActivityCategory = document.createElement("div");
        resultActivityCategory.id = "resultActivityCategory";
        resultPanel.className = "detailSubPanel";
        resultActivityCategory.innerHTML = "Category: " + recommendedActivities[i].category;

        var resultActivityPrice = document.createElement("div");
        resultActivityPrice.id = "resultActivityPrice";
        resultPanel.className = "detailSubPanel";
        resultActivityPrice.innerHTML = "Average Price: £" + recommendedActivities[i].price;

        resultPanel.appendChild(resultActivityName);
        resultPanel.appendChild(resultActivityDescription);
        resultPanel.appendChild(resultActivityAge);
        resultPanel.appendChild(resultActivityCategory);
        resultPanel.appendChild(resultActivityPrice);

        reccommendationResults.appendChild(resultPanel);
    }
}

function filterActivities() {
    let ageInput = document.getElementById("ageFilterInput").value;
    let categoryInput = document.getElementById("categoryFilterInput").value;
    let lowerPriceInput = document.getElementById("lowerPriceFilterInput").value;
    let upperPriceInput = document.getElementById("upperPriceFilterInput").value;

    let filterResults = structuredClone(activityArray);

    filterResults = filterAge(filterResults, ageInput);
    filterResults = filterCategory(filterResults, categoryInput);
    filterResults = filterPrice(filterResults, lowerPriceInput, upperPriceInput);

    displayFilteredActivities(filterResults);
}

function displayFilteredActivities(filteredActivities) {
    let filterResults = document.getElementById("filterResults");
    filterResults.innerHTML = "";

    for (let i = 0; i < filteredActivities.length; i++) {
        var resultPanel = document.createElement("div");
        resultPanel.className = "resultPanel";

        var resultActivityName = document.createElement("div");
        resultActivityName.id = "resultActivityName";
        resultPanel.className = "detailSubPanel";
        resultActivityName.innerHTML = "Activity: " + filteredActivities[i].activityName;

        var resultActivityDescription = document.createElement("div");
        resultActivityDescription.id = "resultActivityDescription";
        resultPanel.className = "detailSubPanel";
        resultActivityDescription.innerHTML = "Description: " + filteredActivities[i].description;

        var resultActivityAge = document.createElement("div");
        resultActivityAge.id = "resultActivityAge";
        resultPanel.className = "detailSubPanel";
        resultActivityAge.innerHTML = "Age Category: " + filteredActivities[i].age;

        var resultActivityCategory = document.createElement("div");
        resultActivityCategory.id = "resultActivityCategory";
        resultPanel.className = "detailSubPanel";
        resultActivityCategory.innerHTML = "Category: " + filteredActivities[i].category;

        var resultActivityPrice = document.createElement("div");
        resultActivityPrice.id = "resultActivityPrice";
        resultPanel.className = "detailSubPanel";
        resultActivityPrice.innerHTML = "Average Price: £" + filteredActivities[i].price;

        resultPanel.appendChild(resultActivityName);
        resultPanel.appendChild(resultActivityDescription);
        resultPanel.appendChild(resultActivityAge);
        resultPanel.appendChild(resultActivityCategory);
        resultPanel.appendChild(resultActivityPrice);

        filterResults.appendChild(resultPanel);
    }
}

//Filters activites to ones that exist near the given activity.
function activityVicinity(viewedActivity, range) {
    let activities = structuredClone(activityArray);
    activities = activities.filter(activity => activity.activityName == viewedActivity.activityName);
    let potentialActivities = [];

    for (let i = 0; i < activities.length; i++) {
        if (getDistance(activities[i].latitude, activities[i].longitude, viewedActivity.latitude, viewedActivity.longitude) <= range) {
            potentialActivities.push(activities[i]);
        }
    }

    return potentialActivities;
}

//Filters activites to ones that exist near the given coordinates.
function filterArea(latitude, longitude, range) {
    let activities = structuredClone(activityArray);
    let potentialActivities = [];

    if (range == "All") {
        return potentialActivities;
    } else {
        for (let i = 0; i < activities.length; i++) {
            if (getDistance(activities[i].latitude, activities[i].longitude, latitude, longitude) <= range) {
                potentialActivities.push(activities[i]);
            }
        }
        return potentialActivities;
    }
}

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

function filterPrice(potentialActivities, givenPriceLower, givenPriceUpper) {
    let filteredActivities = [];

    if (givenPriceLower == "Any" | givenPriceUpper == "Any") {
        return potentialActivities;
    } else {
        for (let i = 0; i < potentialActivities.length; i++) {
            if (potentialActivities[i].price >= givenPriceLower && potentialActivities[i].price <= givenPriceUpper) {
                filteredActivities.push(potentialActivities[i]);
            }
        }
    }

    return filteredActivities;
}

// Let users submit their own activities to the application
// Store and process these so they can be displayed in the map when called
async function saveCustomLocation(event) {
    let activityName = document.getElementById("nameSubmissionInput").value;
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
        description: description,
        age: age,
        category: category,
        price: price,
        latitude: latitude,
        longitude: longitude,
        postDate: postDate
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





//
//Get Functions
//

//Calculates the distance between two points "as the crow flies".
//Source: http://www.movable-type.co.uk/scripts/latlong.html
function getDistance(latitude1, longitude1, latitude2, longitude2) {
    const R = 6371e3 //Metres
    const phi1 = latitude1 * Math.PI / 180;
    const phi2 = latitude2 * Math.PI / 180;
    const lambda1 = longitude1 * Math.PI / 180;
    const lambda2 = longitude2 * Math.PI / 180;

    const deltaPhi = phi2 - phi1;
    const deltaLambda = lambda2 - lambda1;

    const a = (Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2)) + ((Math.cos(phi1) * Math.cos(phi2)) * (Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    const d = R * c;

    return d;
}

//Source: https://stackoverflow.com/questions/1230233/how-to-find-the-sum-of-an-array-of-numbers
function getAverageRating(activityName) {
    let selectedRatings = [];

    //Filter the reviews into a list of review rating values only for the desired activity.
    for (let i = 0; i < reviewArray.length; i++) {
        if (reviewArray[i].parentActivityName == activityName) {
            selectedRatings.push(reviewArray[i].rating);
        }
    }
    let ratingCount = selectedRatings.length;

    let ratingSum = selectedRatings.reduce((cumulativeSum, value) => cumulativeSum + value, 0);
    let averageRating = ratingSum / ratingCount;

    return averageRating;
}

