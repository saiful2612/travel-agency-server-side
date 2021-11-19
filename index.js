const express = require("express");
const cors = require("cors");
const { MongoClient } = require("mongodb");
const ObjectId = require("mongodb").ObjectId;
const app = express();

//Config .env
require("dotenv").config();

//Middleware
app.use(express.json());
app.use(cors());

//App running port
const PORT = process.env.PORT || 8000;
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.mhs2r.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;

const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
async function run() {
  try {
    //DB connection
    await client.connect();
    const database = client.db("travel_agnency");
    const tourCollection = database.collection("travelData");
    const orderCollection = database.collection("orders");
    /* ====================Tours Api ========================= */
    //GET API
    app.get("/tours", async (req, res) => {
      const result = await tourCollection.find({});
      const users = await result.toArray();
      res.json(users);
    });
    //Get by _id
    app.get("/tours/:_id", async (req, res) => {
      const result = await tourCollection.findOne({
        _id: ObjectId(req.params._id),
      });
      res.json(result);
    });
    //POST API
    app.post("/tours", async (req, res) => {
      const result = await tourCollection.insertOne(req.body);
      res.json(result);
    });
    /* ==================== Orders Api ===================== */
    //GET API
    app.get("/orders", async (req, res) => {
      const result = await orderCollection.find({});
      const users = await result.toArray();
      res.json(users);
    });
    //Get by Email
    app.get("/orders/:email", async (req, res) => {
      const result = await orderCollection.find({
        email: req.params.email,
      });
      const userOrders = await result.toArray();
      res.json(userOrders);
    });
    //POST API
    app.post("/orders", async (req, res) => {
      const result = await orderCollection.insertOne(req.body);
      res.json(result);
    });

    //UPDATE API
    app.patch("/orders/:_id", async (req, res) => {
      const filter = { _id: ObjectId(req.params._id) };
      const updateDoc = {
        $set: req.body,
      };
      const result = await orderCollection.findOneAndUpdate(filter, updateDoc);
      res.json(result);
    });
    //DELETE API
    app.delete("/orders/:_id", async (req, res) => {
      const result = await orderCollection.deleteOne({
        _id: ObjectId(req.params._id),
      });
      res.json(result);
    });
  } catch (err) {
    console.error(err.message);
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send(`<h2>App running on port ${PORT}</h2>`);
});

app.get("/Hi", (req, res) => {
  res.send(`<h2>Say HI, from mongo DB</h2>`);
});

app.listen(PORT, () => {
  console.log("listening to port", PORT);
});
