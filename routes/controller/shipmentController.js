import pool from "../../config/config.js";
import query from "../../utils/query.js";

const generateRandomId = () => {
  return Math.floor(Math.random() * 90000) + 1;
};

export const deleteShipment = (req, res) => {
  const shipmentId = req.params.id;

  const selectShipmentQuery = `
      SELECT customer_id FROM shipment WHERE shipment_id = ?`;

  const deleteShipmentQuery = `
      DELETE FROM shipment WHERE shipment_id = ?`;

  const deleteCustomerDetailsQuery = `
      DELETE FROM customer_details WHERE id = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res
        .status(500)
        .json({ error: "Failed to connect to the database." });
    }
    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        console.error("Error beginning transaction:", transactionErr);
        connection.release();
        return res.status(500).json({ error: "Failed to begin transaction." });
      }

      connection.query(
        selectShipmentQuery,
        [shipmentId],
        (selectErr, selectResult) => {
          if (selectErr) {
            console.error("Error selecting shipment data:", selectErr);
            connection.rollback(() => {
              connection.release();
              console.log("Failed to select data");
              return res
                .status(500)
                .json({ error: "Failed to select shipment data." });
            });
          } else if (selectResult.length === 0) {
            console.log("Shipment data not found.");
            connection.release();
            return res.status(404).json({ error: "Shipment data not found." });
          } else {
            const customerIds = selectResult[0].customer_id
              .split(",")
              .map(Number);

            connection.query(
              deleteShipmentQuery,
              [shipmentId],
              (shipmentErr, shipmentResult) => {
                if (shipmentErr) {
                  console.error("Error deleting shipment data:", shipmentErr);
                  connection.rollback(() => {
                    connection.release();
                    console.log("Failed to delete data");
                    return res
                      .status(500)
                      .json({ error: "Failed to delete shipment data." });
                  });
                } else {
                  // Loop through customer IDs and delete data for each ID
                  for (const customerId of customerIds) {
                    connection.query(
                      deleteCustomerDetailsQuery,
                      [customerId],
                      (customerErr, customerResult) => {
                        if (customerErr) {
                          console.error(
                            "Error deleting customer data:",
                            customerErr
                          );
                          connection.rollback(() => {
                            connection.release();
                            console.log("Failed to delete data");
                            return res.status(500).json({
                              error: "Failed to delete customer data.",
                            });
                          });
                        } else {
                          console.log(
                            `Data deleted successfully for customer ID ${customerId}.`
                          );
                        }
                      }
                    );
                  }

                  connection.commit((commitErr) => {
                    if (commitErr) {
                      console.error("Error committing transaction:", commitErr);
                      connection.rollback(() => {
                        connection.release();
                        console.log("Failed to delete data");
                        return res
                          .status(500)
                          .json({ error: "Failed to commit transaction." });
                      });
                    } else {
                      console.log("Data deleted successfully.");
                      connection.release();
                      return res
                        .status(200)
                        .json({ message: "Data deleted successfully." });
                    }
                  });
                }
              }
            );
          }
        }
      );
    });
  });
};

/* get Customer Details */

export const getCustomerDetails = (req, res) => {
  const query = "SELECT * FROM customer_details";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Error retrieving data" });
    } else {
      res.json(results);
    }
  });
};

/* get Customer Deatils Main */

export const customerDetailsmain = (req, res) => {
  const dispatcherName = req.query.name;

  // If there is no dispatcherName parameter, fetch all shipments
  let query = "SELECT * FROM  createcustomer";

  // If dispatcherName is provided, filter shipments based on the dispatcher
  if (dispatcherName) {
    query = "SELECT * FROM  createcustomer WHERE name = ?";
  }

  pool.query(query, [dispatcherName], (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Error retrieving data" });
    } else {
      res.json(results);
    }
  });
};

/* Create new id shipment */

export const newIdShipment = (req, res) => {
  const {
    latitude,
    latitude1,
    longitude,
    longitude1,
    customer_name,
    customer_contact,
    customer_email,
    customer_alt_num,
    pick_up_location,
    pick_up_before,
    description,
    customer_name2,
    customer_contact2,
    drop_location,
    drop_description,
    drop_date,
    vehicleplate,
    helper1,
    helper2,
    driver_id,
    customer_name1,
    customer_contact1,
    customer_email1,
    customer_alt_num1,
    pick_up_location1,
    pick_up_before1,
    shipment_type1,
    description1,
    drop_date1,
    customer_name21,
    customer_contact21,
    drop_location1,
    drop_description1,
    driver_name,
    randomId = generateRandomId(),
  } = req.body;

  const title = "Shipment Request.";
  const message =
    "Hello there! You have a new shipment to deliver with a Shipment ID of " +
    randomId +
    ". Please review it.";

  if (!driver_id) {
    return res.status(400).json({ error: "Missing driver_id in request body" });
  }

  const insertQuery = `
      INSERT INTO customer_details (customer_name, customer_contact, customer_email, customer_alt_num, pick_up_location, pick_up_before, description, customer_name2, customer_contact2, drop_location, drop_description, longitude, latitude, drop_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  const shipmentQuery = `
      INSERT INTO shipment (shipment_id, vehicleplate, helper1, helper2, driver_id, driver_name, customer_id) 
      VALUES (?, ?, ?, ?, ?, ?, ?)`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res
        .status(500)
        .json({ error: "Failed to connect to the database." });
    }
    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        console.error("Error beginning transaction:", transactionErr);
        return res.status(500).json({ error: "Failed to begin transaction." });
      }

      connection.query(
        insertQuery,
        [
          customer_name,
          customer_contact,
          customer_email,
          customer_alt_num,
          pick_up_location,
          pick_up_before,
          description,
          customer_name2,
          customer_contact2,
          drop_location,
          drop_description,
          longitude1,
          latitude1,
          drop_date,
        ],
        (insertErr, insertResult) => {
          if (insertErr) {
            console.error("Error inserting data:", insertErr);
            connection.rollback(() => {
              return res.status(500).json({ error: "Failed to insert data." });
            });
          } else {
            const customer_id = insertResult.insertId;

            if (
              customer_name1 ||
              customer_contact1 ||
              customer_email1 ||
              customer_alt_num1 ||
              pick_up_location1 ||
              pick_up_before1 ||
              description1 ||
              customer_name21 ||
              customer_contact21 ||
              drop_location1 ||
              drop_description1 ||
              longitude ||
              latitude ||
              drop_date1
            ) {
              const customer_id1 = customer_id;
              const customer_id2 = customer_id + 1;
              const customer_id_string = [customer_id1, customer_id2];
              const customer_id_combined = customer_id_string.join(",");

              connection.query(
                insertQuery,
                [
                  customer_name1,
                  customer_contact1,
                  customer_email1,
                  customer_alt_num1,
                  pick_up_location1,
                  pick_up_before1,
                  description1,
                  customer_name21,
                  customer_contact21,
                  drop_location1,
                  drop_description1,
                  longitude,
                  latitude,
                  drop_date1,
                ],

                (insertErr) => {
                  if (insertErr) {
                    console.error("Error inserting data:", insertErr);
                    connection.rollback(() => {
                      console.log("Failed to insert data");
                      return res
                        .status(500)
                        .json({ error: "Failed to insert data." });
                    });
                  } else {
                    connection.query(
                      shipmentQuery,
                      [
                        randomId,
                        vehicleplate,
                        helper1,
                        helper2,
                        driver_id,
                        driver_name,
                        customer_id_combined,
                      ],
                      (shipmentErr) => {
                        if (shipmentErr) {
                          console.error(
                            "Error inserting shipment data:",
                            shipmentErr
                          );
                          connection.rollback(() => {
                            connection.release();
                            console.log("Failed to insert data");
                            return res.status(500).json({
                              error: "Failed to insert shipment data.",
                            });
                          });
                        } else {
                          connection.commit((commitErr) => {
                            if (commitErr) {
                              console.error(
                                "Error committing transaction:",
                                commitErr
                              );
                              connection.rollback(() => {
                                console.log("Failed to insert data");
                                return res.status(500).json({
                                  error: "Failed to commit transaction.",
                                });
                              });
                            } else {
                              console.log("Data inserted successfully.");
                              return res.status(200).json({
                                message: "Data inserted successfully.",
                              });
                            }
                          });
                        }
                      }
                    );
                  }
                }
              );
            } else {
              connection.query(
                shipmentQuery,
                [
                  randomId,
                  vehicleplate,
                  helper1,
                  helper2,
                  driver_id,
                  driver_name,
                  customer_id,
                ],
                (shipmentErr) => {
                  if (shipmentErr) {
                    console.error(
                      "Error inserting shipment data:",
                      shipmentErr
                    );
                    connection.rollback(() => {
                      console.log("Failed to insert data");
                      return res
                        .status(500)
                        .json({ error: "Failed to insert shipment data." });
                    });
                  } else {
                    connection.commit((commitErr) => {
                      if (commitErr) {
                        console.error(
                          "Error committing transaction:",
                          commitErr
                        );
                        connection.rollback(() => {
                          console.log("Failed to insert data");
                          return res
                            .status(500)
                            .json({ error: "Failed to commit transaction." });
                        });
                      } else {
                        console.log("Data inserted successfully.");
                        return res
                          .status(200)
                          .json({ message: "Data inserted successfully." });
                      }
                    });
                  }
                }
              );
            }
          }
        }
      );
    });
    pool.releaseConnection(connection);
  });
};

// export const newIdShipment = (req, res) => {
//   const {
//     latitude,
//     latitude1,
//     longitude,
//     longitude1,
//     customer_name,
//     customer_contact,
//     customer_email,
//     customer_alt_num,
//     pick_up_location,
//     pick_up_before,
//     description,
//     customer_name2,
//     customer_contact2,
//     drop_location,
//     drop_description,
//     drop_date,
//     vehicleplate,
//     helper1,
//     helper2,
//     driver_id,
//     customer_name1,
//     customer_contact1,
//     customer_email1,
//     customer_alt_num1,
//     pick_up_location1,
//     pick_up_before1,
//     shipment_type1,
//     description1,
//     drop_date1,
//     customer_name21,
//     customer_contact21,
//     drop_location1,
//     drop_description1,
//     driver_name,
//     randomId = generateRandomId(),
//   } = req.body;

//   const title = "Shipment Request.";
//   const message =
//     "Hello there! You have a new shipment to deliver with a Shipment ID of " +
//     { generateRandomId } +
//     " Please review it.";

//   if (!driver_id) {
//     return res.status(400).json({ error: "Missing driver_id in request body" });
//   }

//   const insertQuery = `
//       INSERT INTO customer_details (customer_name, customer_contact, customer_email, customer_alt_num, pick_up_location, pick_up_before, description, customer_name2, customer_contact2, drop_location, drop_description, longitude, latitude, drop_date) 
//       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

//   const shipmentQuery = `
//       INSERT INTO shipment (shipment_id, vehicleplate, helper1, helper2, driver_id, driver_name, customer_id) 
//       VALUES (?, ?, ?, ?, ?, ?, ?)`;

//   pool.getConnection((err, connection) => {
//     if (err) {
//       console.error("Error getting connection:", err);
//       return res
//         .status(500)
//         .json({ error: "Failed to connect to the database." });
//     }
//     connection.beginTransaction((transactionErr) => {
//       if (transactionErr) {
//         console.error("Error beginning transaction:", transactionErr);
//         connection.release();
//         return res.status(500).json({ error: "Failed to begin transaction." });
//       }

//       connection.query(
//         insertQuery,
//         [
//           customer_name,
//           customer_contact,
//           customer_email,
//           customer_alt_num,
//           pick_up_location,
//           pick_up_before,
//           description,
//           customer_name2,
//           customer_contact2,
//           drop_location,
//           drop_description,
//           longitude1,
//           latitude1,
//           drop_date,
//         ],
//         (insertErr, insertResult) => {
//           if (insertErr) {
//             console.error("Error inserting data:", insertErr);
//             connection.rollback(() => {
//               connection.release();
//               return res.status(500).json({ error: "Failed to insert data." });
//             });
//           } else {
//             const customer_id = insertResult.insertId;

//             if (
//               customer_name1 &&
//               customer_contact1 &&
//               customer_email1 &&
//               customer_alt_num1 &&
//               pick_up_location1 &&
//               pick_up_before1 &&
//               description1 &&
//               customer_name21 &&
//               customer_contact21 &&
//               drop_location1 &&
//               drop_description1 &&
//               longitude &&
//               latitude &&
//               drop_date1
//             ) {
//               const customer_id1 = customer_id;
//               const customer_id2 = customer_id + 1;
//               const customer_id_string = [customer_id1, customer_id2];
//               const customer_id_combined = customer_id_string.join(",");

//               connection.query(
//                 insertQuery,
//                 [
//                   customer_name1,
//                   customer_contact1,
//                   customer_email1,
//                   customer_alt_num1,
//                   pick_up_location1,
//                   pick_up_before1,
//                   description1,
//                   customer_name21,
//                   customer_contact21,
//                   drop_location1,
//                   drop_description1,
//                   longitude,
//                   latitude,
//                   drop_date1,
//                 ],

//                 (insertErr) => {
//                   if (insertErr) {
//                     console.error("Error inserting data:", insertErr);
//                     connection.rollback(() => {
//                       connection.release();
//                       console.log("Failed to insert data");
//                       return res
//                         .status(500)
//                         .json({ error: "Failed to insert data." });
//                     });
//                   } else {
//                     connection.query(
//                       shipmentQuery,
//                       [
//                         randomId,
//                         vehicleplate,
//                         helper1,
//                         helper2,
//                         driver_id,
//                         driver_name,
//                         customer_id_combined,
//                       ],
//                       (shipmentErr) => {
//                         if (shipmentErr) {
//                           console.error(
//                             "Error inserting shipment data:",
//                             shipmentErr
//                           );
//                           connection.rollback(() => {
//                             connection.release();
//                             console.log("Failed to insert data");
//                             return res.status(500).json({
//                               error: "Failed to insert shipment data.",
//                             });
//                           });
//                         } else {
//                           connection.commit((commitErr) => {
//                             if (commitErr) {
//                               console.error(
//                                 "Error committing transaction:",
//                                 commitErr
//                               );
//                               connection.rollback(() => {
//                                 connection.release();
//                                 console.log("Failed to insert data");
//                                 return res.status(500).json({
//                                   error: "Failed to commit transaction.",
//                                 });
//                               });
//                             } else {
//                               console.log("Data inserted successfully.");
//                               connection.release();
//                               return res.status(200).json({
//                                 message: "Data inserted successfully.",
//                               });
//                             }
//                           });
//                         }
//                       }
//                     );
//                   }
//                 }
//               );
//             } else {
//               connection.query(
//                 shipmentQuery,
//                 [
//                   randomId,
//                   vehicleplate,
//                   helper1,
//                   helper2,
//                   driver_id,
//                   driver_name,
//                   customer_id,
//                 ],
//                 (shipmentErr) => {
//                   if (shipmentErr) {
//                     console.error(
//                       "Error inserting shipment data:",
//                       shipmentErr
//                     );
//                     connection.rollback(() => {
//                       connection.release();
//                       console.log("Failed to insert data");
//                       return res
//                         .status(500)
//                         .json({ error: "Failed to insert shipment data." });
//                     });
//                   } else {
//                     connection.commit((commitErr) => {
//                       if (commitErr) {
//                         console.error(
//                           "Error committing transaction:",
//                           commitErr
//                         );
//                         connection.rollback(() => {
//                           connection.release();
//                           console.log("Failed to insert data");
//                           return res
//                             .status(500)
//                             .json({ error: "Failed to commit transaction." });
//                         });
//                       } else {
//                         console.log("Data inserted successfully.");
//                         connection.release();
//                         return res
//                           .status(200)
//                           .json({ message: "Data inserted successfully." });
//                       }
//                     });
//                   }
//                 }
//               );
//             }
//           }
//         }
//       );
//     });
//   });
// };

/* get Merge APi Data */

export const getMergeApiData = (req, res) => {
  const getCustomerIdsQuery = "SELECT DISTINCT customer_id FROM shipment";
  pool.query(getCustomerIdsQuery, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "An error occurred" });
      return;
    }
    const customerIds = results.map((result) => result.customer_id);

    const getAllDataQuery = `
      SELECT
        customer_details.customer_name,
        MAX(shipment.shipment_id) AS shipment_id,
        MAX(customer_details.customer_contact) AS customer_contact,
        MAX(customer_details.customer_email) AS customer_email,
        MAX(customer_details.customer_alt_num) AS customer_alt_num,
        MAX(customer_details.pick_up_location) AS pick_up_location,
        MAX(customer_details.pick_up_before) AS pick_up_before,
        MAX(customer_details.description) AS description,
        GROUP_CONCAT(DISTINCT customer_details.customer_name2) AS customer_name2,
        GROUP_CONCAT(DISTINCT customer_details.customer_contact2) AS customer_contact2,
        GROUP_CONCAT(DISTINCT customer_details.drop_location) AS drop_location,
        GROUP_CONCAT(DISTINCT customer_details.drop_date) AS drop_date,
        MAX(customer_details.drop_description) AS drop_description,
        MAX(shipment.driver_name) AS driver_name,
        MAX(shipment.helper1) AS helper1,
        MAX(shipment.helper2) AS helper2,
        MAX(shipment.vehicleplate) AS vehicleplate,
        MAX(shipment.created_at) AS created_at,
        MAX(customer_details.pick_up_status) AS pick_up_status,
        GROUP_CONCAT(DISTINCT customer_details.id) AS id
      FROM shipment
      LEFT JOIN customer_details ON
        CASE
          WHEN LOCATE(',', shipment.customer_id) > 0
          THEN FIND_IN_SET(customer_details.id, shipment.customer_id)
          ELSE customer_details.id = shipment.customer_id
        END
      WHERE shipment.customer_id IN (${customerIds.join(",")})
      GROUP BY customer_details.customer_name
      ORDER BY shipment.id DESC;
    `;

    pool.query(getAllDataQuery, (error, dataResults) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }
      res.json(dataResults);
    });
  });
};

/* Get Merge Api Data using customer Id */

export const getMergeApiDataCustomerId = (req, res) => {
  const customerId = req.params.customerId;
  const getCustomerQuery = `
      SELECT shipment.*, customer_details.*
      FROM shipment
      LEFT JOIN customer_details ON
        CASE
          WHEN LOCATE(',', shipment.customer_id) > 0
          THEN FIND_IN_SET(customer_details.id, shipment.customer_id)
          ELSE customer_details.id = shipment.customer_id
        END
      WHERE shipment.shipment_id = ?`;

  pool.query(getCustomerQuery, [customerId], (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "An error occurred" });
    } else {
      if (results.length === 0) {
        res.status(404).json({ error: "Customer not found" });
      } else {
        res.json(results);
      }
    }
  });
};

/* get Shipment Count */

export const shipmentCount = (req, res) => {
  const query = "SELECT COUNT(id) AS idCount FROM shipment";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const idCount = results[0].idCount;
    res.status(200).json({ count: idCount });
  });
};

/* Get Shipment Count Status */

export const getShipmentCountStatus = (req, res) => {
  const query = "SELECT COUNT(id) AS idCount FROM shipment WHERE status = 4";

  pool.query(query, (err, results) => {
    if (err) {
      console.error("Error executing query:", err);
      res.status(500).json({ error: "Internal server error" });
      return;
    }

    const idCount = results[0].idCount;
    res.status(200).json({ count: idCount });
  });
};

/* Delete Customer By Id */

export const deleteCustomerById = (req, res) => {
  const id = req.params.id;
  const sql = "DELETE FROM customer_details WHERE id = ?";

  pool.query(sql, [id], (err, result) => {
    if (err) {
      console.error("Error deleting customer detail:", err);
      return res.status(500).json({ error: "Internal server error" });
    }
    res.json({ message: "Row deleted successfully" });
  });
};

/* Update Customer Using Customer Id */

export const updateCustomerByCustomerID = (req, res) => {
  const customerId = req.params.customerId;
  console.log(customerId);
  const {
    customer_name,
    customer_name2,
    customer_contact,
    customer_contact2,
    customer_email,
    helper1,
    helper2,
    driver_name,
    vehicleplate,
    pick_up_location,
    customer_alt_num,
    drop_location,
    drop_date,
    pick_up_before,
  } = req.body;

  const updateCustomerQuery = `
      UPDATE customer_details 
      SET 
        customer_name = ?,
        customer_contact = ?,
        customer_email = ?,
        customer_alt_num = ?,
        pick_up_location = ?,
        drop_location = ?,
        customer_name2 = ?,
        customer_contact2 = ?,
        drop_date = ?,
        pick_up_before = ?
      WHERE id = ?`;

  const updateShipmentQuery = `
      UPDATE shipment 
      SET 
        helper1 = ?,
        helper2 = ?,
        driver_name = ?,
        vehicleplate = ?
      WHERE id = ?`;

  pool.getConnection((err, connection) => {
    if (err) {
      console.error("Error getting connection:", err);
      return res
        .status(500)
        .json({ error: "Failed to connect to the database." });
    }
    connection.beginTransaction((transactionErr) => {
      if (transactionErr) {
        console.error("Error beginning transaction:", transactionErr);
        connection.release();
        return res.status(500).json({ error: "Failed to begin transaction." });
      }

      connection.query(
        updateCustomerQuery,
        [
          customer_name,
          customer_contact,
          customer_email,
          customer_alt_num,
          pick_up_location,
          drop_location,
          customer_name2,
          customer_contact2,
          drop_date,
          pick_up_before,
          customerId,
        ],
        (updateCustomerErr, updateCustomerResult) => {
          if (updateCustomerErr) {
            console.error("Error updating customer data:", updateCustomerErr);
            connection.rollback(() => {
              connection.release();
              return res
                .status(500)
                .json({ error: "Failed to update customer data." });
            });
          } else {
            connection.query(
              updateShipmentQuery,
              [helper1, helper2, driver_name, vehicleplate, customerId],
              (updateShipmentErr, updateShipmentResult) => {
                if (updateShipmentErr) {
                  console.error(
                    "Error updating shipment data:",
                    updateShipmentErr
                  );
                  connection.rollback(() => {
                    connection.release();
                    return res
                      .status(500)
                      .json({ error: "Failed to update shipment data." });
                  });
                } else {
                  connection.commit((commitErr) => {
                    if (commitErr) {
                      console.error("Error committing transaction:", commitErr);
                      connection.rollback(() => {
                        connection.release();
                        return res
                          .status(500)
                          .json({ error: "Failed to commit transaction." });
                      });
                    } else {
                      console.log("Data updated successfully.");
                      connection.release();
                      return res
                        .status(200)
                        .json({ message: "Data updated successfully." });
                    }
                  });
                }
              }
            );
          }
        }
      );
    });
  });
};

/* Get merge api data pending  */

export const mergeApiDataPending = (req, res) => {
  const getCustomerIdsQuery = "SELECT DISTINCT customer_id FROM shipment";

  pool.query(getCustomerIdsQuery, (error, results) => {
    if (error) {
      console.error("Error executing query:", error);
      res.status(500).json({ error: "An error occurred" });
      return;
    }

    const customerIds = results.map((result) => result.customer_id);

    const getAllDataQuery = `
        SELECT shipment.*, customer_details.*
        FROM shipment
        LEFT JOIN customer_details ON
          CASE
            WHEN LOCATE(',', shipment.customer_id) > 0
            THEN FIND_IN_SET(customer_details.id, shipment.customer_id)
            ELSE customer_details.id = shipment.customer_id
          END
        WHERE shipment.customer_id IN (${customerIds.join(",")})
        AND customer_details.pick_up_status = 1  -- Added condition for pick_up_status = 1
        ORDER BY shipment.id DESC
      `;

    pool.query(getAllDataQuery, (error, dataResults) => {
      if (error) {
        console.error("Error executing query:", error);
        res.status(500).json({ error: "An error occurred" });
        return;
      }

      res.json(dataResults);
    });
  });
};
