const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
const port = process.env.PORT || 5000;

// brandShop
// 6AAm2QWmiY80rY77

// middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://brandShop:6AAm2QWmiY80rY77@cluster0.8wqvy9o.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const brandsCollection = client.db("brandShop").collection("brandProducts");
    const cartCollection = client.db("brandShop").collection("cartProduct");

    app.get("/brandProducts", async (req, res) => {
      const cursor = brandsCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    app.get("/brandProducts/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await brandsCollection.findOne(query);
      res.send(result);
    });

    app.get("/cartProduct", async (req, res) => {
      const cursor = cartCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/brandProducts", async (req, res) => {
      const newProduct = req.body;
      const result = await brandsCollection.insertOne(newProduct);
      res.send(result);
    });

    app.post("/cartProduct", async (req, res) => {
      const cartProduct = req.body;
      const result = await cartCollection.insertOne(cartProduct);
      res.send(result);
    });

    app.put("/brandProducts/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const option = { upsert: true };
      const updatedValue = req.body;
      const updatedProduct = {
        $set: {
          name: updatedValue.name,
          brand_name: updatedValue.brand_name,
          image: updatedValue.image,
          price: updatedValue.price,
          rating: updatedValue.rating,
          type: updatedValue.type,
          description: updatedValue.description,
        },
      };
      const result = await brandsCollection.updateOne(
        filter,
        updatedProduct,
        option
      );
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("server is running");
});

app.listen(port, () => {
  console.log("server is running on port 5000");
});
