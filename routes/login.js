import express from "express";
import jwt from "jsonwebtoken";
import pool from "../config/config.js";
const Router = express.Router();
import mysql from "mysql";

const generateAccessToken = (username) => {
  return jwt.sign(username, process.env.TOKEN_SECRET);
};

Router.post("/", function (req, res) {
  const username = req.body.username;
  const password = req.body.password;

  pool.getConnection(function (err, conn) {
    if (err) {
      console.log(err);
    } else {
      //check credentials in database
      conn.query(
        "SELECT * FROM identities WHERE username=?",
        username,
        function (err, rows) {
          //console.log(rows);
          if (rows.length > 0) {
            if (rows[0].password === password) {
              // console.log("User Found");
              const user_id1 = rows[0].id;

              //generate token
              const token = generateAccessToken({ username, user_id1 });

              res.json({
                login: true,
                token: token,
                user_id: user_id1,
                msg: "Login successfull",
              });
            } else {
              console.log("incorrect password");
              res.send({ login: false, msg: "Incorrect password" });
            }
          } else {
            res.send({ login: false, msg: "User not found" });
          }
        }
      );
      pool.releaseConnection(conn);
    }
  });
});


// Dashboard Route
Router.get("/dashboard", (req, res) => {
  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send("Token not provided");
  }

  jwt.verify(
    token,
    "4n/+KLTdzwyDhLr4NHTeqFIIWNUxpJakZyLOTvuZ",
    (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }

      const userId = decoded.id;
      const query = `SELECT * FROM dispatcher WHERE id = ?`;

      pool.query(query, userId, (err, results) => {
        if (err) {
          res.status(500).send("Internal Server Error");
        } else {
          if (results.length > 0) {
            const user = results[0];
            res.status(200).json({ user });
          } else {
            res.status(404).send("User not found");
          }
        }
      });
    }
  );
});


Router.put("/updateadminapi/:id", (req, res) => {
  const id = req.params.id;
  const { username, contact, password } = req.body;

  const sql =
    "UPDATE identities SET username = ?, contact = ?, password = ? WHERE id = ?";

  pool.query(sql, [username, contact, password, id], (err, result) => {
    if (err) {
      console.error("Error updating admin:", err);
      return res.status(500).json({ error: "Error updating admin." });
    }
    res.status(200).json({ message: "Admin updated successfully." });
  });
});
Router.get('/getidentities', (req, res) => {
  const query = 'SELECT * FROM identities';

  pool.query(query, (error, results) => {
    if (error) {
      console.error('Error executing query:', error);
      res.status(500).json({ error: 'An error occurred' });
      return;
    }

    res.json(results);
  });
});

export default Router;
