
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5020;



// middlewares-------------------------------------------------------------------------------------------->>>>>
app.use(cors({
    origin:["http://localhost:5173"],
    credentials:true
}))
app.use(express.json())
require('dotenv').config()
// middlewares-------------------------------------------------------------------------------------------->>>>>


// ----------------------------------------------------MongoDB-------------------------------------------->>>>>

const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.frg7rqf.mongodb.net/?retryWrites=true&w=majority`;

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const addedFoodCollection = client.db('ShareAbite').collection('addedFoodCollection');


    // post a food on collection api -------------------->>>>>
    app.post('/addFood',async(req,res)=>{
        const data = req.body;
        const result = await addedFoodCollection.insertOne(data)
        res.send(result)
    })

    // get all food api -------------------------------->>>>>
    app.get('/getFoods',async(req,res)=>{
        const result = await addedFoodCollection.find({}).toArray()
        res.send(result)
    })


















    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

// ----------------------------------------------------MongoDB-------------------------------------------->>>>>







app.get('/',(req,res)=>{
    res.send("Server is coming soon...");
})



app.listen(port,()=>{
    console.log(`Server is running on http://localhost:${port}`);
})
