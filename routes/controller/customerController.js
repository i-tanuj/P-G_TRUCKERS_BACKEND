// import pool from "../../config/config.js";
import express from "express";
const Router = express.Router();
import pool from "../../config/config.js";
import query from "../../utils/query.js";
// create customer API

export const createCustomer = (req, res) => {
  const query = 'SELECT * FROM createcustomer ORDER BY DateAndTime DESC';

  pool.query(query, (error, results, fields) => {
    if (error) {
      console.error('Error executing MySQL query: ' + error.message);
      res.status(500).send('Internal Server Error');
      return;
    }

    res.json(results);
  });
};


// get all customer details by id
export const customerData = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM createcustomer WHERE id = ${id}`;
  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result[0]);
  });
};

export const deleteCustomerById = (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM createcustomer WHERE id = ${id}`;

  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ message: "Row deleted successfully" });
  });
};

export const updateCustomerById = (req, res) => {
  try {
    const id = req.params.id;
    const { name, email, phoneno, altphone, address } = req.body;

    const sql = `UPDATE createcustomer SET name=?, email=?, phoneno=?, altphone=?, address=? WHERE id=?`;
    const values = [name, email, phoneno, altphone, address, id];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
      } else {
        res.send({ result: "Customer updated successfully" });
        console.log("Update successful!");
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
};

const generateRandomId = () => {
  return Math.floor(Math.random() * 90000) + 1;
};

//   Add Customer
export const addCustomer = (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      const randomId = generateRandomId();
      const name = req.body.name;
      const email = req.body.email;
      const phoneno = req.body.phoneno;
      const altphone = req.body.altphone;
      const address = req.body.address;

      const sql = `INSERT INTO createcustomer (id,name,email,phoneno,altphone,address)
              VALUES (${randomId},'${name}','${email}','${phoneno}','${altphone}','${address}')`;
      const result = await query(sql, conn);
      if (result) {
        res.send({ result: "successfully added" });
      } else {
        res.send({ result: "Something went wrong" });
      }
    }
  });
};

//   update customer
export const updateCustomer = (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      const id = req.body.id;
      const name = req.body.name;
      const email = req.body.email;
      const phoneno = req.body.phoneno;
      const altphone = req.body.altphone;
      const address = req.body.address;
      const sql = `UPDATE createcustomer SET name="${name}", email="${email}", phoneno="${phoneno}",address="${address}",altphone="${altphone}" WHERE id=${id}`;
      const result = await query(sql, conn);
      if (result) {
        res.send({ result: "successfully updated" });
      } else {
        res.send({ result: "Something went wrong" });
      }
    }
  });
};

//   delete customer
export const deleteCustomer = (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      res.status(500).send("Server Error");
    } else {
      const ID = req.body.id;
      const full_name = req.body.full_name;
      const sql = `DELETE FROM createcustomer WHERE id=${ID}`;
      const result = await query(sql, conn);
      if (result) {
        res.send("successfully deleted");
      } else {
        res.send({ result: "Something went wrong" });
      }
    }
  });
};
