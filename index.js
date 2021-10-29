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

        // // Use POST to get data by keys
        // app.post('/products/byKeys', async (req, res) => {
        //     const keys = req.body;
        //     const query = { key: { $in: keys } }
        //     const products = await productCollection.find(query).toArray();
        //     res.json(products);
        // });

        // Add Orders API
        app.post('/booking', async (req, res) => {
            const booking = req.body;
            const result = await bookingCollection.insertOne(booking);
            res.json(result);
        })

        // POST API - ADD NEW PLACE
        app.post('/places', async (req, res) => {
            const addPlace = req.body;
            const result = await placesCollection.insertOne(addPlace);
            res.json(result);
        });

        // // DELETE API
        // app.delete('/services/:id', async (req, res) => {
        //     const id = req.params.id;
        //     const query = { _id: ObjectId(id) };
        //     const result = await servicesCollection.deleteOne(query);
        //     res.send(result);
        // })

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