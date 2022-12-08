import pool from "../psqlDbOperations/psqlDBConnect.mjs";

export default function updateUser(req, res) {
  const { email_id, column, value } = req.body;

  pool.query(
    `UPDATE users SET ${column}='${value}' WHERE email_id='${email_id}'`,
    (err) => {
      if (err) {
        console.log(err);
        res.status(422).send("something went wrong");
      } else {
        res.status(200).send("user updated successfully");
      }
    }
  );
}
