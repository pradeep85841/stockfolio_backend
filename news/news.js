import { createRequire } from "module";
const require = createRequire(import.meta.url);
import fetch from "node-fetch";
import mongoose from "mongoose";
const MongoClient = require("mongodb").MongoClient;

mongoose.connect(
  "mongodb+srv://developer:root@stockfolio.rnte1rd.mongodb.net/?retryWrites=true&w=majority",
  {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  }
);

const postSchema = new mongoose.Schema({
  data: [
    {
      author: { type: String, required: true },
      title: { type: String, required: true },
      description: { type: String, required: true },
      url: { type: String, required: true },
      source: { type: String, required: true },
      image: { type: String, required: true },
      category: { type: String, required: true },
      language: { type: String, required: true },
      country: { type: String, required: true },
      published_at: { type: String, required: true },
    },
  ],
});

const Post = mongoose.model("Post", postSchema);

async function getPosts() {
  let myPosts = await fetch(
    "http://api.mediastack.com/v1/news?access_key=7fc209cdc1a32244f278f255e9811958&keywords=stocks&countries=in&language=en"
  );

  let response = await myPosts.json();
  let string = JSON.stringify(response);
  for (let i = 0; i < response.length; i++) {
    const post = new Post({
      data: [
        {
          author: string["author"],
          title: string["title"],
          description: string["description"],
          url: string["url"],
          source: string["source"],
          image: string["image"],
          category: string["category"],
          language: string["language"],
          country: string["country"],
          published_at: string["publishedAt"],
        },
      ],
    });
    post.save();
  }
}
getPosts();

let postDb = fetch(
  "http://api.mediastack.com/v1/news?access_key=7fc209cdc1a32244f278f255e9811958&keywords=stocks&countries=in&language=en"
)
  .then((response) => response.json())
  .then((json) => {
    MongoClient.connect(
      "mongodb+srv://developer:root@stockfolio.rnte1rd.mongodb.net/?retryWrites=true&w=majority",
      function (err, client) {
        if (err) throw err;
        const dbo = client.db("stockfolio");
        dbo.collection("posts").insertOne(json, function (err, res) {
          if (err) throw err;
        });
      }
    );
  });

export default mongoose;
