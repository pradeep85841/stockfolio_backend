import { createRequire } from "module";
const require = createRequire(import.meta.url);
const DB = process.env.DATABASE

const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: DB,
  database: "stockfolio",
  password: "root",
  port: 5432,
});

pool.connect(function (err) {
  if(err) throw err;
  console.log(`connection to stockfolio DB success`);
});

export default pool;
