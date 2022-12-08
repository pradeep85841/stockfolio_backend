import pool from "../psqlDbOperations/psqlDBConnect.mjs";
import * as stockfolioDb from "../psqlDbOperations/psqlQueries.mjs";

export default async function signUp(req, res) {
  const { name, email, phone, password } = req.body;

  const tableExists = await stockfolioDb.tableExists("users");
  const tableName = "users";

  if (tableExists != true) {
    pool.query(
      `CREATE TABLE ${tableName}(user_id SERIAL PRIMARY KEY, name varchar(250), email_id varchar(250), phone_no varchar(50), password varchar(150))`,
      (err) => {
        if (err) throw err;
      }
    );
  }

  pool.query(
    `select name from users where lower(email_id) = lower('${email}')`,
    (err, result) => {
      if (err) console.error(err);
      if (result.rows.length !== 0) {
        res.status(422).json({ error: "email already exists" });
      } else {
        const userSignUp = `INSERT INTO users("name", "email_id","phone_no" , "password") 
        VALUES($1, $2, $3, $4)`;

        var values = [name, email, phone, password];

        pool.query(userSignUp, values);

        res.status(200).json({ message: "success" });
      }
    }
  );
}
