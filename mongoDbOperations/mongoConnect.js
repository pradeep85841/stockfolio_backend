import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DB = process.env.MONGO_DATABASE
const MongoClient = require('mongodb').MongoClient;

// var uri = "mongodb+srv://developer:root@stockfolio.rnte1rd.mongodb.net/?retryWrites=true&w=majority";
//var uri = 'mongodb://localhost:27017'
const client = new MongoClient(DB)

const connection = client.connect((err)=>{
if(err) throw err;
});
 
const db = client.db('stockfolio');

export default db;
