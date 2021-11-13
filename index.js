const express=require('express');

const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config()

const app= express();
const port = process.env.PORT || 5000;

//midleware

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.2z78o.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
console.log(uri);
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run() {
    try {
      await client.connect();
      const database = client.db("carCollect");
      const servicesCollection = database.collection("services");
      const orderCollection = database.collection("order");
      const reviewCollection = database.collection("review");
      // create a document to insert

//manage order
app.get('/order',async(req,res)=>{
    const cursor=orderCollection.find({});
    const result =await cursor.toArray()
    res.send(result)
})





// get order api
app.get("/order/:email",
async(req,res)=>{
    const email=req.params.email;
    const result= await orderCollection.find({email}).toArray();
    console.log(result)
    res.send(result);
}

);







    //  post api for order

    app.post('/order',async(req,res)=>{
        const orders=req.body;
        const result=await orderCollection.insertOne(orders);
        console.log(result)
        res.json(result)

    })






//get single services
app.get('/services/:id',async(req,res)=>{
    const id=req.params.id;
    const query={_id:ObjectId(id)};
    const service= await servicesCollection.findOne(query);
    res.json(service)
})



      //postApi services
app.post('/services',async(req,res)=>{
const service=req.body;
const result =await servicesCollection.insertOne(service)
res.json(result);
})

//get api services
app.get('/services',async(req,res)=>{
const cursor = servicesCollection.find({});
const services = await cursor.toArray()
res.send(services)

})

// delete api
app.delete('/order/:id',async(req,res)=>{
    const id =req.params.id;
    const query = {_id:ObjectId(id)};
    const result =await orderCollection.deleteOne(query);
    res.json(result);

})

// post review
app.post('/review',async(req,res)=>{
    const reviews=req.body;
    const result=await reviewCollection.insertOne(reviews);
    console.log(result)
    res.json(result);
})
// get review
app.get('/review',async(req,res)=>{
    const cursor = reviewCollection.find({});
    const reviews =await cursor.toArray();
    res.json(reviews)
})




      
    } finally {
    //   await client.close();
    }
  }
  run().catch(console.dir);






app.get('/',(req,res)=>{
    res.send('running car server');
})

app.listen(port,()=>{
    console.log('running car server portal car deploy',port)
})