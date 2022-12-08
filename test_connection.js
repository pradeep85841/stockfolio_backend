import db from "./mongoDbOperations/mongoConnect.js";
const client = db;

client
  .collection("posts")
  .find({})
  .toArray((error, result) => {});
