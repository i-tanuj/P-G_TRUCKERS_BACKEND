import express from "express";
import {
  customerDetailsmain,
  deleteCustomerById,
  deleteShipment,
  getCustomerDetails,
  getMergeApiData,
  getMergeApiDataCustomerId,
  getShipmentCountStatus,
  mergeApiDataPending,
  newIdShipment,
  shipmentCount,
  updateCustomerByCustomerID,
} from "./controller/shipmentController.js";
const router = express.Router();

router.delete("/deleteShipmentsby/:id", deleteShipment);
router.get("/customer-details", getCustomerDetails);
router.get("/customer-details-main", customerDetailsmain);
router.post("/newidshipment", newIdShipment);
router.get("/mergeapidata", getMergeApiData);
router.get("/mergeapidata/:customerId", getMergeApiDataCustomerId);
router.get("/shipmentcount", shipmentCount);
router.get("/shipmentcountstatus", getShipmentCountStatus);
router.delete("/customerdelete/:id", deleteCustomerById);
router.put("/updatecustomer/:customerId", updateCustomerByCustomerID);
router.get("/mergeapidatapending", mergeApiDataPending);

export default router;
