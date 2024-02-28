import pool from "../../config/config.js";
import query from "../../utils/query.js";

// Router.get("/totalAmountsum", (req, res) => {
export const totalAmountsum = (req, res) => {
  const query = "SELECT SUM(amount) AS totalAmount FROM money";

  // Execute the query
  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const totalAmount = results[0].totalAmount;
    res.status(200).json({ totalAmount });
  });
};

export const getPayment = (req, res) => {
  const { full_name, driver_id, shipment_id, amount } = req.body;
  if (!full_name || !shipment_id || !amount) {
    return res.status(400).json({ error: "All fields are required." });
  }

  const insertQuery =
    "INSERT INTO money (full_name, driver_id, shipment_id, amount) VALUES (?, ?, ?, ?)";
  pool.query(
    insertQuery,
    [full_name, driver_id, shipment_id, amount],
    (insertErr, insertResult) => {
      if (insertErr) {
        console.error("Error inserting data:", insertErr);
        return res.status(500).json({ error: "Failed to insert data." });
      }

      console.log("Data inserted successfully.");

      // Calculate the new settlement_amount
      const selectQuery =
        "SELECT SUM(amount) AS total_amount FROM money WHERE driver_id = ?";
      pool.query(selectQuery, [driver_id], (selectErr, selectResult) => {
        if (selectErr) {
          console.error("Error selecting data:", selectErr);
          return res.status(500).json({ error: "Failed to select data." });
        }

        const newSettlementAmount = parseFloat(selectResult[0].total_amount);

        // Update the settlement_amount
        const updateQuery =
          "UPDATE money SET settlement_amount = ? WHERE driver_id = ?";
        pool.query(
          updateQuery,
          [newSettlementAmount, driver_id],
          (updateErr, updateResult) => {
            if (updateErr) {
              console.error("Error updating settlement amount:", updateErr);
              return res
                .status(500)
                .json({ error: "Failed to update settlement amount." });
            }

            console.log("Settlement amount updated successfully.");
            res.status(200).json({
              message:
                "Data inserted and settlement amount updated successfully.",
            });
          }
        );
      });
    }
  );
};

export const sumMoney = (req, res) => {
  const { id, updateddatetime } = req.body;
  const newtotal_amount = 0;
  // const newStatus = 2;
  try {
    const query = `
        SELECT full_name, updateddatetime, SUM(amount) AS total_amount
        FROM money
        GROUP BY driver_id
      `;

    pool.query(query, (err, result) => {
      if (err) {
        console.error("Error querying database:", err);
        res.status(500).json({ error: "Internal Server Error" });
        return;
      }

      res.json(result);
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

export const updateAmounts = (req, res) => {
  const { driver_id, updateddatetime } = req.body;
  const newAmount = 0;
  const newStatus = 2;

  // Update the data in the SQL table
  const query = `UPDATE money SET settlement_amount = ?, status = ?, updateddatetime=? WHERE driver_id = ?`;
  pool.query(
    query,
    [newAmount, newStatus, updateddatetime, driver_id],
    (err, result) => {
      if (err) {
        console.error("Error updating data:", err);
        res.status(500).json({ error: "Error updating data" });
      } else {
        console.log("Data updated successfully");
        res.json({ message: "Data updated successfully" });
      }
    }
  );
};

export const getAllPayment = (req, res) => {
  const query =
    "SELECT id, full_name, shipment_id, amount, DateAndTime, updateddatetime FROM money";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data." });
    }

    const formattedResults = results.map((row) => ({
      full_name: row.full_name,
      id: row.id,
      shipment_id: row.shipment_id,
      amount: row.amount,
      DateAndTime: row.DateAndTime,
      updateddatetime: row.updateddatetime,
      //   DateAndTime: row.DateAndTime.toISOString().slice(0, 19).replace('T', ' '), // Format date to 'YYYY-MM-DD HH:mm:ss'
    }));

    res.status(200).json(formattedResults);
  });
};

export const sattlementRecords = (req, res) => {
  const query =
    "SELECT * FROM money GROUP BY driver_id ORDER BY DateAndTime DESC";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error fetching data:", err);
      return res.status(500).json({ error: "Failed to fetch data." });
    }
    const formattedResults = results.map((row) => ({
      full_name: row.full_name,
      id: row.id,
      driver_id: row.driver_id,
      settlement_amount: row.settlement_amount,
    }));

    res.status(200).json(formattedResults);
  });
};

export const getIdentities = (req, res) => {
  const query = "SELECT * FROM identities"; // Replace "identities" with your actual table name

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }
    res.status(200).json(results);
  });
};
