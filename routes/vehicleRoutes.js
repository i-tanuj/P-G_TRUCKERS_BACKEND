import express from "express";
import {
    updatevehicleByID,
    deleteVehicleById,
    createVehicle,
    getVehicleDetails,
    vehicleDataById,
    addVehicle
} from "./controller/vehicleController.js";
const router = express.Router();

router.put("updatevehicleapi/:id", updatevehicleByID);

router.delete("/vehicledelete/:id", deleteVehicleById);

router.get("/creatvehical", createVehicle);

router.get("/vehicledetails", getVehicleDetails);

router.get("/vehicledata/:id", vehicleDataById);

router.post("/addvehical", addVehicle);



export default router;
