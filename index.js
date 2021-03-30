const express = require('express')
const cors = require('cors');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;
const {DB_USER, DB_PASS, DB_NAME} = process.env
const port =process.env.PORT || 3005

const app = express()
app.use(cors())
app.use(bodyParser.json())

const uri = `mongodb+srv://${DB_USER}:${DB_PASS}@cluster0.hyqj7.mongodb.net/${DB_NAME}?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
client.connect(err => {
  const collection = client.db("test").collection("devices");
  console.log('Connected Server to mongodb');
});


app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port)