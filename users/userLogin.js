import pool from "../psqlDbOperations/psqlDBConnect.mjs";
import jwt from "jsonwebtoken";

export default function login(req, res) {
  const { email_id, password } = req.body;

  try {
    pool.query(
      `select * from users where lower(email_id) = lower('${email_id}') AND lower(password) = lower('${password}')`,
      (err, result) => {
        if (err) console.error(err);
        if (result.rows.length !== 0) {
          const id = result.rows.user_id;
          const token = jwt.sign({ id }, "jwtSecret", {
            expiresIn: 25892000000,
          });
          res.status(200).json({ auth: true, token: token, data: result.rows[0]});
        } else {
          res.status(422).json({ error: "wrong credentials" });
        }
      }
    );
  } catch {
    if (err) throw err;
  }
}
