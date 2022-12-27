const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion } = require("mongodb");
require("dotenv").config();
const port = process.env.PORT || 5000;

//middleware
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.qpavz6c.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

async function run() {
  const userCollections = client.db("mini-media").collection("users");
  try {
    // saved user info
    app.post("/user", async (req, res) => {
      const user = req.body;
      const result = await userCollections.insertOne(user);
      res.send(result);
    });
    app.get("/users/:email", async (req, res) => {
      const email = req.params.email;
      const query = { email: email };
      const users = await userCollections.findOne(query);
      res.send(users);
    });
  } finally {
  }
}
run().catch((err) => console.error(err));
app.get("/", (req, res) => {
  res.send("mini-media-server is running");
});

app.listen(port, () => {
  console.log(`media server listening on port ${port}`);
});
