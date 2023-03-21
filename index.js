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
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.88ouu.mongodb.net/?retryWrites=true&w=majority`;
// console.log(uri);
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
    // create review collection
    const reviewCollection = database.collection('review');
    // create order collection
    const orderCollection = database.collection('order');
    // send message
    const messageCollection = database.collection('message');
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
      const allproduct = await cursor.toArray();
      res.json(allproduct);
    });
    //get product by id
    app.get('/product/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const product = await productCollection.findOne(query);
      res.json(product);
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
    //get all order
    app.get('/order',async(req,res)=>{
      const cursor = orderCollection.find({});
      const order = await cursor.toArray();
      res.json(order);
    });
    //add order
    app.post('/order',async(req,res)=>{
      const data = req.body;
      const result = await orderCollection.insertOne(data);
      res.json(result);
    });
    //delete order
    app.delete('/order/:id',async(req,res)=>{
      const id = req.params.id;
      const query = { _id: ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.json(result);
    });
    //update status
    app.put('/order/:id',async(req,res)=>{
      const id = req.params.id;
      const itemData = req.body;
      const filter = { _id:ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name:itemData.name,
          email:itemData.email,
          phone:itemData.phone,
          address:itemData.address,
          product_id:itemData.product_id,
          product_name:itemData.product_name,
          details:itemData.details,
          price:itemData.price,
          status:itemData.status
        },
      };
      const result = await orderCollection.updateOne(filter, updateDoc, options);
      res.json(result);
    })
    //get my order
    app.get('/myorder/:email',async(req,res)=>{
      const email = req.params.email;
      const cursor = orderCollection.find({email:email});
      const myorder = await cursor.toArray();
      res.json(myorder);
    });
    //create admin
    app.post('/admin',async(req,res)=>{
      const data = req.body;
      const requesterAccount = await userCollection.findOne({ email: data.requester });
      
      if(requesterAccount.role === 'admin'){
        const checkAccount = await userCollection.findOne({ email: data.email });
        if(checkAccount){
          const filter = { email: data.email };
          const updateDoc = { $set: { role: 'admin' } };
          const result = await userCollection.updateOne(filter, updateDoc);
          res.json(result);
        }else{
          res.json({status:404});
        }
      }else{
        res.json({status:401});
      }
    })
    //get review
    app.get('/review',async(req,res)=>{
      const cursor = reviewCollection.find({});
      const result = await cursor.toArray();
      res.json(result);
    });
    //add review
    app.post('/review',async(req,res)=>{
      const data = req.body;
      const result = await reviewCollection.insertOne(data);
      res.json(result);
    });
    //store message
    app.post('/message',async(req,res)=>{
      const data = req.body;
      const result = await messageCollection.insertOne(data);
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