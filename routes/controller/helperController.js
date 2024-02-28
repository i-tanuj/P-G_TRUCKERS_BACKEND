import pool from "../../config/config.js";
import query from "../../utils/query.js";

export const createHelper = (req, res) => {
    pool.getConnection(async (err, conn) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      } else {
        const id = req.body.id;
        const sql = `SELECT * from helper ORDER BY DateAndTime DESC`;
        const result = await query(sql, conn);
        if (result) {
          res.send(result);
        } else {
          res.send({ result: "Something went wrong" });
        }
      }
    });
  };

  
export const gethelperData = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM helper WHERE id = ${id}`;
  
    pool.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result[0]);
    });
  };

  
const generateRandomId = () => {
    return Math.floor(Math.random() * 90000) + 1;
  };

  
export const addHelperData = (req, res) => {
    pool.getConnection(async (err, conn) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      } else {
        const randomId = generateRandomId();
        const name = req.body.name;
        const email = req.body.email;
        const address = req.body.address;
        const phoneno = req.body.phoneno;
        const sql = `INSERT INTO helper (id,name,email,phoneno,address)
              VALUES (${randomId},'${name}','${email}','${phoneno}','${address}')`;
        const result = await query(sql, conn);
        if (result) {
          res.send({ result: "successfully added" });
        } else {
          res.send({ result: "Something went wrong" });
        }
      }
    });
  };

  
export const updateHelperById = (req, res) => {
    const id = req.params.id;
    const { name, email, phoneno, address } = req.body;
  
    const sql =
      "UPDATE helper SET name = ?, email = ?, phoneno = ?, address = ? WHERE id = ?";
  
    pool.query(sql, [name, email, phoneno, address, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error updating driver." });
      }
      res.status(200).json({ message: "Helper updated successfully." });
    });
  };

  
export const deleteHelperById = (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM helper WHERE id = ${id}`;
  
    pool.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json({ message: "Row deleted successfully" });
    });
  };