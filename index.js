// dependencies
const express = require('express');
const app = express();
const cors = require('cors');
const { MongoClient } = require("mongodb");
require('dotenv').config();
const ObjectId = require('mongodb').ObjectId;
//middleware
app.use(cors());
app.use(express.json());

//variable
const port = process.env.PORT || 5000;

// Connection URI
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.88ouu.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
// Create a new MongoClient
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
  try {
    // Connect the client to the server
    await client.connect();
    // create database
    const database = client.db('dream-car');
    // create service collection
    const userCollection = database.collection('users');
    // create product collection
    const productCollection = database.collection('product');
    app.post('/user',async(req,res)=>{
        const data = req.body;
        // console.log(req.body);
        const result = await userCollection.insertOne(data);
        res.json(result);
    });

    app.get('/user/:email', async (req, res) => {
        const email = req.params.email;
        const query = { email: email };
        const user = await userCollection.findOne(query);
        // console.log(user);
        res.json(user);
    });
    //get product
    app.get('/product',async(req,res)=>{
      const cursor = productCollection.find({});
      const allorder = await cursor.toArray();
      res.json(allorder);
    });
    //add product
    app.post('/product',async(req,res)=>{
      const data = req.body;
      const result = await productCollection.insertOne(data);
      res.json(result);
    });
    //delete product
    app.delete('/product/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await productCollection.deleteOne(query);
      res.json(result);
  });
    console.log("Connected successfully to server");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

//home page
app.get('/',(req,res)=>{
    res.send('Hello This is Dream-Car Server');
})
// start server
app.listen(port,()=>{
    console.log(`listenig at ${port}`);
});