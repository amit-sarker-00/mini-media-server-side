const express = require("express");
const app = express();
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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
  const PostCollections = client.db("mini-media").collection("posts");
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

    // update user info
    app.put("/editAbout/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: ObjectId(id) };
      const update = req.body;
      console.log(update);

      const option = { upsert: true };
      const updateAbout = {
        $set: {
          name: update.name,
          email: update.email,
          photoURL: update.photoURL,
        },
      };
      const result = await userCollections.updateOne(
        filter,
        updateAbout,
        option
      );
      console.log(result);
      res.send(result);
    });
    //create and get post
    app.post("/createPost", async (req, res) => {
      const post = req.body;
      post.date = new Date();
      const newPost = await PostCollections.insertOne(post);
      res.send(newPost);
    });

    app.get("/posts", async (req, res) => {
      const query = {};
      const allPosts = await PostCollections.find(query).toArray();
      res.send(allPosts);
    });

    //post details
    app.get("/details/:id", async (req, res) => {
      const id = req.params.id;
      const details = { _id: ObjectId(id) };
      const result = await PostCollections.findOne(details);
      res.send(result);
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
