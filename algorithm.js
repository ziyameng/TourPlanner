const activityArray = [
    {activityName: "Activity One", avgRating: 2, latitude:17, longitude: 10,},
    {activityName: "Activity Two", avgRating: 3.5, latitude:17, longitude: 8},
    {activityName: "Activity Three", avgRating: 1, latitude:17, longitude: 7},
    {activityName: "Activity Four", avgRating: 3, latitude:17, longitude: 7},
    {activityName: "Activity Five", avgRating: 3.5, latitude:17, longitude: 7},
    {activityName: "Activity Six", avgRating: 2.33, latitude:17, longitude: 7},
    {activityName: "Activity Seven", avgRating: 1.25, latitude:17, longitude: 7},
    {activityName: "Activity Eight", avgRating: 5, latitude:17, longitude: 7}
]



//Popular Near You (PNY)
//Source: https://jsfiddle.net/45c5r246/34/
function PNYAlgorithm(viewedActivity) {
    let recommendedActivityCount = 3;

    let potentialActivities = withinArea(viewedActivity.longitude, viewedActivity.latitude);
    let recommendedActivities = [];

    //Source: https://stackoverflow.com/questions/10024866/remove-object-from-array-using-javascript
    for (let i = 0; i < recommendedActivityCount; i++) {
        let maxRating = Math.max.apply(Math, potentialActivities.map(function(activity){return activity.avgRating;}))
        let maxRatedActivity = potentialActivities.find(function(activity){return activity.avgRating == maxRating;})
        
        recommendedActivities.push(maxRatedActivity);
        potentialActivities = potentialActivities.filter( activity => activity.activityName == maxRatedActivity.activityName);
    }

    return recommendedActivities;
}

//Filters activites to ones that exist locally.
function withinArea(viewedActivity) {
    let activities = structuredClone(activityArray);

    activities = activities.filter(activity => activity.activityName == viewedActivity.activityName);

    let potentialActivities = [];
    let maxDistance = 30; //In kilometres

    for (let i = 0; i < activities.length; i++) {
        if (getDistance(activities[i].latitude, activities[i].longitude, viewedActivity.latitude, viewedActivity.longitude) <= maxDistance) {
            potentialActivities.push(activities[i]);
        }
    }    

    return potentialActivities;
}

//Calculates the distance between two points "as the crow flies".
//Source: http://www.movable-type.co.uk/scripts/latlong.html
function getDistance(latitude1, longitude1, latitude2,  longitude2) {
    const R = 6371e3 //Metres
    const phi1 = latitude1*Math.PI/180;
    const phi2 = latitude2*Math.PI/180;
    const lambda1 = longitude1*Math.PI/180;
    const lambda2 = longitude2*Math.PI/180;

    const deltaPhi = phi2-phi1;
    const deltaLambda = lambda2-lambda1;

    const a = (Math.sin(deltaPhi/2)*Math.sin(deltaPhi/2)) + ((Math.cos(phi1)*Math.cos(phi2)) * (Math.sin(deltaLambda/2)*Math.sin(deltaLambda/2)));
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    const d = R * c;

    return d;
}
