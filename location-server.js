const express = require('express')
const app = express()
const port = 12345

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
app.get('/', (req, res) => {
    res.send('Hello World!')
  })

app.post('/location/add', async (req, res) => {

    const location_collection = db.collection('location');

    // create a document to insert
    const location = req.body

    location['activities'] = []

    const result = await location_collection.insertOne(location)
    
    // console.log(result)

    res.status(200).send("add sucess" + result);
})

app.get('/location/get/all', async (req, res) => {
    const location_collection = db.collection('location');

    const query = {}
    const options = {}

    let results = []

    let cursor = location_collection.find(query, options)

    await cursor.forEach((item) => results.push(item))

    res.status(200).send(results)
})

app.get('/location/get/byname', async (req, res) => {
    const location_collection = db.collection('location');

    const query = { locationName : req.body.locationName }
    const options = {}

    let results = []

    let cursor = location_collection.find(query, options)

    await cursor.forEach((item) => results.push(item))

    res.status(200).send(results)
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})