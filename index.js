
const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5020;



// middlewares-------------------------------------------------------------------------------------------->>>>>
app.use(cors({
  origin: ["http://localhost:5173"],
  credentials: true
}))
app.use(express.json())
require('dotenv').config()
// middlewares-------------------------------------------------------------------------------------------->>>>>


// ----------------------------------------------------MongoDB-------------------------------------------->>>>>

const { MongoClient, ServerApiVersion, ObjectId, ConnectionPoolMonitoringEvent } = require('mongodb');
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
    const requestCollection = client.db('ShareAbite').collection('requestFoodCollection');


    // post a food on collection api -------------------->>>>>
    app.post('/addFood', async (req, res) => {
      const data = req.body;
      const result = await addedFoodCollection.insertOne(data)
      res.send(result)
    })

    // get all food api -------------------------------->>>>>
    app.get('/getFoods', async (req, res) => {
      const result = await addedFoodCollection.find({}).toArray()
      res.send(result)
    })

    // get one food api -------------------------------->>>>>
    app.get('/getFoods/:sid', async (req, res) => {
      const id = req.params.sid;
      const query = { _id: new ObjectId(id) }
      const result = await addedFoodCollection.findOne(query)
      res.send(result)
    })

    // put request to request collection--------------->>>>>
    app.put('/putReq', async (req, res) => {
      const data = req.body;
      console.log(data);
      const query = { requset_food_id: data.requset_food_id, requester_email: data.requester_email }

      const exist = await requestCollection.findOne(query)

      if (exist) {
        res.send("Already Added")
      } else {
        // if this is my food then res.send("This is your food !")
        const result = await requestCollection.insertOne(data)
        res.send(result)
      }
    })

    // get user request foods api----------------------->>>>>
    app.get('/getUserReqFood', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { requester_email: req.query.email }
      }
      const result = await requestCollection.find(query).toArray()
      res.send(result)
    })

    // delete food request api------------------------->>>>>
    app.delete('/reqDelete/:sid', async (req, res) => {
      const id = req.params.sid
      const query = { _id: new ObjectId(id) }
      const result = await requestCollection.deleteOne(query)
      res.send(result)
    })

    // get my added foods----------------------------->>>>>
    app.get('/myaddedFoods', async (req, res) => {
      let query = {}
      if (req.query?.email) {
        query = { donar_email: req.query.email }
      }
      const result = await addedFoodCollection.find(query).toArray()
      res.send(result)
    })

    // delete data one food from manage food--------->>>>>
    app.delete('/manageDelete/:sid', async (req, res) => {
      const id = req.params.sid;
      const query = { _id: new ObjectId(id) }
      const result = await addedFoodCollection.deleteOne(query)
      if (result.deletedCount === 1) {
        const reqFilter = { requset_food_id: id }
        const exist = await requestCollection.findOne(reqFilter)
        if (exist) {
          const finalResult = await requestCollection.deleteOne(reqFilter)
          res.send(finalResult)
        } else {
          res.send(result)
        }
      }
      // res.send(result)
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







app.get('/', (req, res) => {
  res.send("Server is coming soon...");
})



app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
})
