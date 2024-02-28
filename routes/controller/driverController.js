import pool from "../../config/config.js";
import query from "../../utils/query.js";

export const getDriverDetails = (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      const id = req.body.id;
      const sql = `SELECT * FROM users ORDER BY id DESC`;
      const result = await query(sql, conn);
      if (result) {
        res.send(result);
      } else {
        res.send({ result: "Something went wrong" });
      }
    }
  });
};

export const getDriverDetailsOrderByID = (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      const id = req.body.id;
      const sql = `SELECT * from users ORDER BY id DESC`;
      const result = await query(sql, conn);
      if (result) {
        res.send(result);
      } else {
        res.send({ result: "Something went wrong" });
      }
    }
  });
};

export const getDriverDetailsByID = (req, res) => {
  const id = req.params.id;
  const sql = `SELECT * FROM users WHERE id = ${id}`;

  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json(result[0]);
  });
};

export const addDriver = (req, res) => {
  pool.getConnection(async (err, conn) => {
    if (err) {
      console.log(err);
      res.status(500).send("Server Error");
    } else {
      const driver_name = req.body.full_name;
      const driver_email = req.body.email;
      const driver_phone = req.body.phone;
      const driver_password = req.body.password; // Assuming plain text password

      // Encrypt the password
      const saltRounds = 10; // You can adjust this value for security
      const encryptedPassword = await bcrypt.hash(driver_password, saltRounds);

      const driver_address = req.body.address;
      const sql = `INSERT INTO users (full_name, email, phone, address, password, altpassword)
                           VALUES ('${driver_name}','${driver_email}','${driver_phone}','${driver_address}','${encryptedPassword}','${driver_password}')`;

      const result = await query(sql, conn);
      if (result) {
        res.send({ result: "successfully added" });
        console.log("Data inserted ");
      } else {
        res.send({ result: "Something went wrong" });
      }
    }
  });
};

export const deleteDriver = (req, res) => {
  const id = req.params.id;
  const sql = `DELETE FROM users WHERE id = ${id}`;

  pool.query(sql, (err, result) => {
    if (err) {
      throw err;
    }
    res.json({ message: "Row deleted successfully" });
  });
};

export const updateDriver = async (req, res) => {
  const id = req.params.id;
  const { full_name, email, phone, address, altpassword } = req.body;

  try {
    const encryptedPassword = await bcrypt.hash(altpassword, 10); // Encrypt the password

    const sql = `
          UPDATE users 
          SET full_name=?, email=?, phone=?, address=?, password=?, altpassword=?
          WHERE id=?
        `;

    const values = [
      full_name,
      email,
      phone,
      address,
      encryptedPassword,
      altpassword,
      id,
    ];

    pool.query(sql, values, (err, result) => {
      if (err) {
        console.error(err);
        res.status(500).send("Server Error");
      } else {
        res.send({ result: "Driver updated successfully" });
        console.log("Update successful!");
      }
    });
  } catch (error) {
    console.error("Error updating data:", error);
    res.status(500).send("Server Error");
  }
};
