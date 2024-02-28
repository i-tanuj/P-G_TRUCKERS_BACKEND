import pool from "../../config/config.js";
import query from "../../utils/query.js";

export const updatevehicleByID = (req, res) => {
    const id = req.params.id;
    const { name, vehicalplate } = req.body;
  
    const sql = "UPDATE vehical SET name = ?, vehicalplate = ? WHERE id = ?";
  
    pool.query(sql, [name, vehicalplate, id], (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Error updating driver." });
      }
      res.status(200).json({ message: "Helper updated successfully." });
    });
  };

  
export const deleteVehicleById = (req, res) => {
    const id = req.params.id;
    const sql = `DELETE FROM vehical WHERE id = ${id}`;
    pool.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json({ message: "Row deleted successfully" });
    });
  };

  
export const createVehicle = (req, res) => {
    pool.getConnection(async (err, conn) => {
      if (err) {
        console.log(err);
        res.status(500).send("Server Error");
      } else {
        const sql = `SELECT * from vehical ORDER BY id DESC`; // Change the query to include ORDER BY id DESC
        const result = await query(sql, conn);
  
        if (result) {
          res.send(result);
        } else {
          res.send({ result: "Something went wrong" });
        }
      }
    });
  };

export const getVehicleDetails = (req, res) => {
    const query = "SELECT * FROM vehical";
  
    pool.query(query, (error, results, fields) => {
      if (error) {
        console.error("Error executing MySQL query: " + error.message);
        res.status(500).send("Internal Server Error");
        return;
      }
  
      res.json(results);
    });
  };

export const vehicleDataById = (req, res) => {
    const id = req.params.id;
    const sql = `SELECT * FROM vehical WHERE id = ${id}`;
  
    pool.query(sql, (err, result) => {
      if (err) {
        throw err;
      }
      res.json(result[0]);
    });
  };
  

  
export const addVehicle = (req, res) => {
    const { id, name, vehicalplate } = req.body;
  
    // Validate the incoming data
    if (!name || !vehicalplate) {
      return res.status(400).json({ error: "All fields are required." });
    }
    // Insert data into the shipments table
    const query = "INSERT INTO vehical (id, name, vehicalplate) VALUES (?, ?, ?)";
    pool.query(query, [id, name, vehicalplate], (err, result) => {
      if (err) {
        console.error("Error inserting data:", err);
        return res.status(500).json({ error: "Failed to insert data." });
      }
  
      console.log("Data inserted successfully.");
      res.status(200).json({ message: "Data inserted successfully." });
    });
  };
  