import pool from "../../config/config.js";
import query from "../../utils/query.js";

export const deleteDispatcherById = (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM dispatcher WHERE id = ${id}`;
  
    pool.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json({ message: "Row deleted successfully" });
    });
  };



export const getDispatcher = (req, res) => {
    pool.getConnection(async (err, conn) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      } else {
        const id = req.body.id;
        const sql = `SELECT * from dispatcher ORDER BY id DESC`;
        const result = await query(sql, conn);
        if (result) {
          res.send(result);
        } else {
          res.send({ result: "Something went wrong" });
        }
      }
    });
  };

export const addDispatcher = (req, res) => {
    pool.getConnection(async (err, conn) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      } else {
        const name = req.body.name;
        const email = req.body.email;
        const phone = req.body.phone;
        const password = req.body.password;
        const sql = `INSERT INTO dispatcher (name,email,phone,password)
              VALUES ('${name}','${email}','${phone}','${password}')`;
        const result = await query(sql, conn);
        if (result) {
          res.send({ result: "successfully added" });
        } else {
          res.send({ result: "Something went wrong" });
        }
      }
    });
  };
  
export const updateDispatcherById = (req, res) => {
    try {
      const id = req.params.id;
      const { name, email, phone, password } = req.body;
      const sql = `UPDATE dispatcher SET name=?, email=?, phone=?, password=? WHERE id=?`;
      const values = [name, email, phone, password, id];
  
      pool.query(sql, values, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send("Server Error");
        } else {
          res.send({ result: "Driver updated successfully" });
          console.log("Update successful!");
        }
      });
    } catch (err) {
      console.error(err);
      res.status(500).send("Server Error");
    }
  };