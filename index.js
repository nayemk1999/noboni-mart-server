const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config()
const MongoClient = require('mongodb').MongoClient;
const {DB_USER, DB_PASS, DB_NAME} = process.env
const port =process.env.PORT || 3005

const app = express()
app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.hyqj7.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const productsCollection = client.db("noboniMart").collection("products");
  
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
  
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)