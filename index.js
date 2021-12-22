const express=require('express');

const { MongoClient } = require('mongodb');
const ObjectId=require('mongodb').ObjectId;
const cors=require('cors');
require('dotenv').config()

const swaggerUI=require('swagger-ui-express')
const swaggerJSDoc=require('swagger-jsdoc')

const app= express();
const port = process.env.PORT || 5000;

//midleware
app.use(cors());
app.use(express.json());

const options ={
    definition:{
        info:{
            title:'Swagger API demo',
            version:'1.0.0',
            description: '12/22/2021'
        }
    },
}

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
      const userCollection =database.collection("users")
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
//deleted services
app.delete('/services/:id',async(req,res)=>{
    const id =req.params.id;
    const query = {_id:ObjectId(id)};
    const result =await servicesCollection.deleteOne(query);
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

// post user
app.post("/addUserInfo",async(req,res)=>{
console.log(req.body)
    const result =await userCollection.insertOne(req.body);
    res.send(result);
    console.log(result)
})
app.put('/addUserInfo',async(req,res)=>{
const user=req.body;
const filter={ email:user.email};
const options={upsert:true};
const updateDoc = {$set:user};
const result=await  userCollection.updateOne(filter,updateDoc,options);
res.json(result)
})



//make admin
app.put("/makeAdmin",async(req,res)=>{
    const filter={ email:req.body.email};
    const result=await userCollection.find(filter).toArray();
    if(result){
        const document = await userCollection.updateOne(filter,{
            $set: { role:'admin'},
        });
        console.log(document)
    }
})

//check admin
app.get("/checkAdmin/:email",async(req,res)=>{
    const result = await userCollection.find({ email: req.params.email}).toArray();
    console.log(result)
    res.send(result)
})



//status update

app.put("/statusUpdate/:id", async (req, res) => {
    const filter = { _id: ObjectId(req.params.id) };
    console.log(req.params.id);
    const result = await orderCollection.updateOne(filter, {
      $set: {
        status: req.body.status,
      },
    });
    res.send(result);
    console.log(result);
  });

      
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