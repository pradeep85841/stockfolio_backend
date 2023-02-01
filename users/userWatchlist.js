import pool from "../psqlDbOperations/psqlDBConnect.mjs";
import * as stockfolioDb from "../psqlDbOperations/psqlQueries.mjs";

let date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

export default async function usersWatchlist(req, res) {
  const tableExists = await stockfolioDb.tableExists("userswatchlist");
  const tableName = "userswatchlist";

  if (tableExists != true) {
    pool.query(
      `CREATE TABLE ${tableName}(watchlist_id SERIAL PRIMARY KEY, name varchar(250), email_id varchar(250), phone_no varchar(50), watchlist varchar(150), timestamp varchar(50))`,
      (err) => {
        if (err) throw err;
      }
    );
  }

  const { name, email, phone, investment } = req.body;

  var time =
    year +
    "-" +
    month +
    "-" +
    date +
    " " +
    hours +
    ":" +
    minutes +
    ":" +
    seconds;

  const investedUsers = `INSERT INTO userswatchlist("name", "email_id","phone_no" , "watchlist", "timestamp") 
    VALUES($1, $2, $3, $4, $5)`;

  var values = [name, email, phone, investment, time];

  pool.query(investedUsers, values);

  res.status(200).send("user watchlist added");
}

