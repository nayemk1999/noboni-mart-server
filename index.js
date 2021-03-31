const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const ObjectID = require('mongodb').ObjectID;
const port = process.env.PORT || 3005

const app = express()
app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.hyqj7.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
    const productsCollection = client.db("noboniMart").collection("products");
    const ordersCollection = client.db("noboniMart").collection("orders");

    app.post('/addProducts', (req, res) => {
        const newProduct = req.body
        productsCollection.insertOne(newProduct)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/products', (req, res) => {
        productsCollection.find({})
            .toArray((error, document) => {
                res.send(document)
            })
    })

    app.get('/manageProducts', (req, res) => {
        const userEmail = req.query.email
        productsCollection.find({email: userEmail})
            .toArray((error, document) => {
                res.send(document)
            })
    })
    app.get('/product/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productsCollection.find({ _id: id })
            .toArray((error, document) => {
                res.send(document[0])
            })
    })
    app.delete('/product/:id', (req, res) => {
        const id = ObjectID(req.params.id)
        productsCollection.deleteOne({ _id: id })
            .then(result => res.send(result.deletedCount > 0))
    });

    app.post('/addOrder', (req, res) => {
        const newOrder = req.body
        ordersCollection.insertOne(newOrder)
            .then(result => {
                res.send(result.insertedCount > 0)
            })
    });

    app.get('/order', (req, res) => {
        const userEmail = req.query.email
        ordersCollection.find({email: userEmail})
            .toArray((error, document) => {
                res.send(document)
            })
    })

});


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port)