import pool from "../../config/config.js";
import query from "../../utils/query.js";

export const getNotifications = (req, res) => {
    const query = 'SELECT * FROM notifications WHERE user_status = 2 ORDER BY id DESC';
  
    pool.query(query, (error, results, fields) => {
      if (error) {
        console.error('Error executing MySQL query: ' + error.message);
        res.status(500).send('Internal Server Error');
        return;
      }
  
      res.json(results);
    });
  };  


export const insertNotifications = (req, res) => {
    const message = 'Hello there! You have a new shipment to deliver with a Shipment ID of ' +{shipment_id} + 'Please review it.';
    const driverId = req.body.driver_id; // Assuming you send the driver_id in the request body as { "driver_id": 123 }
  
    if (!driverId) {
      return res.status(400).json({ error: 'Missing driver_id in request body' });
    }
  
    const insertQuery = 'INSERT INTO notifications (driver_id, message, user_status) VALUES (?, ?, 1)';
  
    pool.query(insertQuery, [driverId, message], (err, results) => {
      if (err) {
        console.error('Error inserting notification: ' + err.stack);
        res.status(500).json({ error: 'Failed to insert notification' });
      } else {
        console.log('Notification inserted successfully');
        res.json({ message: 'Notification inserted successfully' });
      }
    });
  };