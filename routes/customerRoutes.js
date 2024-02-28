import express from "express";
import {
  createCustomer,
  customerData,
  deleteCustomerById,
  updateCustomerById,
  addCustomer,
  updateCustomer,
  deleteCustomer,
} from "./controller/customerController.js";
const router = express.Router();

router.get("/creatcustomer", createCustomer);

router.get("/customerdata/:id", customerData);

router.delete("/customerdelete/:id", deleteCustomerById);

router.put("/customerupdate/:id", updateCustomerById);

router.post("/addcustomer", addCustomer);

router.post("/updatecustomer", updateCustomer);

router.post("/delcustomer", deleteCustomer);

export default router;
