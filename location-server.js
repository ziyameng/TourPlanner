const express = require('express')
const app = express()
const port = 12345

// mongodb client 
const { MongoClient } = require("mongodb")
const uri = "mongodb://127.0.0.1"
const client = new MongoClient(uri);
const db = client.db('default')

app.use(express.urlencoded({ extended: true })); //optional but useful for url encoded data
app.use(express.json());

/*
const { MongoClient } = require("mongodb");
// Replace the uri string with your connection string.
const uri = "mongodb://127.0.0.1";
const client = new MongoClient(uri);
async function run() {
  try {
    const database = client.db('test');
    const movies = database.collection('movies');

    // create a document to insert
    const doc = {
        title: "Record of a Shriveled Datum",
        content: "No bytes, no problem. Just insert a document, in MongoDB",
    }

    const result = await movies.insertOne(doc)
    // Query for a movie that has the title 'Back to the Future'
    const query = { title: 'Record of a Shriveled Datum' };
    const movie = await movies.findOne(query);
    console.log(movie);
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
*/

/*
const MongoClient = require('mongodb').MongoClient;
const url = "mongodb://127.0.0.1/test";
 
MongoClient.connect(url)
    .then(() => {
        console.log('success')
    })
    .then(function(err, db) {
        console.log(err, db)
    })

app.get('/', (req, res) => {
  res.send('Hello World!')
})

// app.get('/location')

*/

// clear all collections in db
async function deleteAllDataInCollection() {
    const location_collection = db.collection('location')
    const activity_collection = db.collection('activity')
    const comment_collection = db.collection('comment')

    await location_collection.deleteMany({})
    await activity_collection.deleteMany({})
    await comment_collection.deleteMany({})
}

// call this api for clear db
app.get('/', async (req, res) => {
    await deleteAllDataInCollection()
    res.send('clear collections')
  })

// add location to db
app.post('/location/add', async (req, res) => {

    const location_collection = db.collection('location');

    // create a document to insert
    const location = req.body

    // location['activities'] = []

    const result = await location_collection.insertOne(location)
    
    // console.log(result)

    res.status(200).send("add sucess" + result);
})

// get all location from db
app.get('/location/get/all', async (req, res) => {
    const location_collection = db.collection('location');

    const query = {}
    const options = {}

    let results = []

    let cursor = location_collection.find(query, options)

    await cursor.forEach((item) => results.push(item))

    res.status(200).send(results)
})

// get location by locationName
app.get('/location/get/byname', async (req, res) => {
    const location_collection = db.collection('location');

    let location = await getLocationByName(req.body.locationName)

    if(location != null)
        res.status(200).send(location)
    else res.status(400).send("Error: No such location")
})

// add activity to db
app.post('/activity/add', async (req, res) => {
    const activity_collection = db.collection('activity')

    let activity = req.body

    const result = await activity_collection.insertOne(activity)

    res.status(200).send("add sucess" + result);
})

// get all activities of location by the locationName
app.get('/activity/get/bylocation', async (req, res) => {
    const activity_collection = db.collection('activity')

    let locationName = req.body.locationName

    // condition to get data from db
    filter = { 'locationName' : locationName }

    let results = []

    let cursor = activity_collection.find(filter)

    await cursor.forEach((item) => results.push(item))

    res.status(200).send(results)

})

// add comment to db
app.post('/comment/add', async (req, res) => {
    const comment_collection = db.collection('comment')

    let comment = req.body

    const result = await comment_collection.insertOne(comment)

    res.status(200).send("add sucess" + result);
})

// add all comments of activity by the activityName
app.get('/comment/get/byactivity', async (req, res) => {
    const comment_collection = db.collection('comment')

    let activityName = req.body.activityName

    // condition to get data from db
    filter = { 'activityName' : activityName }

    let results = []

    let cursor = comment_collection.find(filter)

    await cursor.forEach((item) => results.push(item))

    res.status(200).send(results)

})

// get single location by locationName from db
async function getLocationByName(name) {
    const location_collection = db.collection('location');

    const query = { locationName : name }
    const options = {}

    let results = []

    let cursor = location_collection.find(query, options)

    await cursor.forEach((item) => results.push(item))

    return results.length == 0 ? null : results[0]
}

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})