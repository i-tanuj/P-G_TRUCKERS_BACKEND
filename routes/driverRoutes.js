import express from "express";
import {
    getDriverDetails,
    getDriverDetailsOrderByID,
    getDriverDetailsByID,
    addDriver,
    deleteDriver,
    updateDriver,
} from "./controller/driverController.js";
const router = express.Router();

router.get("/driver", getDriverDetails);

router.get("/driverdetails", getDriverDetailsOrderByID);

router.get("/users/:id", getDriverDetailsByID);

router.post("/adddriverapi", addDriver);

router.delete("/driverdelete/:id", deleteDriver);

router.put("/updatedriver/:id", updateDriver);

export default router;
