const express = require('express');
const { MongoClient } = require('mongodb');
const ObjectId = require('mongodb').ObjectId;

const cors = require('cors');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.adcng.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
        await client.connect();
        const database = client.db('tourMymensingh');
        const placesCollection = database.collection('places');
        const bookingCollection = database.collection('booking');

        //GET PLACES API
        app.get('/places', async (req, res) => {
            const cursor = placesCollection.find({});
            const places = await cursor.toArray();
            res.send(places);
        });

        // GET SINGLE PLACE BY ID
        app.get('/places/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const places = await placesCollection.findOne(query);
            res.json(places);
        })

        // POST API - ADD NEW PLACE
        app.post('/places', async (req, res) => {
            const addPlace = req.body;
            const result = await placesCollection.insertOne(addPlace);
            res.json(result);
        });

        // Add Orders API
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        });

        // GET ALL BOOKING
        app.get("/allBooking", async (req, res) => {
            const result = await bookingCollection.find({}).toArray();
            res.send(result);
        });

        // DELETE AllBooking API
        app.delete("/deleteBooking/:id", async (req, res) => {
            console.log(req.params.id);
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // GET MyBooking
        app.get("/myBooking/:email", async (req, res) => {
            const result = await bookingCollection.find({
                email: req.params.email,
            }).toArray();
            res.send(result);
        });

        // DELETE MyBooking API
        app.delete("/deleteMyBooking/:id", async (req, res) => {
            const result = await bookingCollection.deleteOne({
                _id: ObjectId(req.params.id),
            });
            res.send(result);
        });

        // PUT UPDATE STATUS API
        app.put("/updateStatus", async (req, res) => {
            const id = req.body.id;
            const query = { _id: ObjectId(id) }
            const options = { upsert: true };
            const updateDoc = {
                $set: {
                    'status': 'Approved'
                },
            };
            const service = await bookingCollection.updateOne(query, updateDoc, options);
            res.send(service);
        });
    }

    finally {
        // await client.close();
    }
}

run().catch(console.dir);

app.get('/', (req, res) => {
    res.send('Tour server is running');
});

app.listen(port, () => {
    console.log('Server running at port', port);
})