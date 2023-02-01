import pool from "../psqlDbOperations/psqlDBConnect.mjs";
import * as stockfolioDb from "../psqlDbOperations/psqlQueries.mjs";

let date_ob = new Date();

let date = ("0" + date_ob.getDate()).slice(-2);
let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
let year = date_ob.getFullYear();
let hours = date_ob.getHours();
let minutes = date_ob.getMinutes();
let seconds = date_ob.getSeconds();

export default async function investedUsers(req, res) {
  const tableExists = await stockfolioDb.tableExists("investedusers");
  const tableName = "investedusers";

  if (tableExists != true) {
    pool.query(
      `CREATE TABLE ${tableName}(investment_id SERIAL PRIMARY KEY, name varchar(250), email_id varchar(250), phone_no varchar(50), investment varchar(150), timestamp varchar(50))`,
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

  const investedUsers = `INSERT INTO investedusers("name", "email_id","phone_no" , "investment", "timestamp") 
    VALUES($1, $2, $3, $4, $5)`;

  var values = [name, email, phone, investment, time];

  pool.query(investedUsers, values);

  res.status(200).send("user investment added");
}

export async function getInvestments(req, res) {

  const { name } = req.body;

  pool.query(
    `select investment from investedusers where name = '${name}' `,
    (err, result) => {
      if (err) console.error(err);
      if (result.rows.length !== 0) {
        res.status(200).json( result.rows[0] );
      } else {
        res.status(422).json({ error: "something went wrong!" });
      }
    }
  );

}
