import express from "express";
import {
    createHelper,
    gethelperData,
    addHelperData,
    updateHelperById,
    deleteHelperById,
} from "./controller/helperController.js";
const router = express.Router();

router.get("/createhelper", createHelper);

router.get("/helperdata/:id", gethelperData);

router.post("/addhelper", addHelperData);

router.put("/updatehelperapi/:id", updateHelperById);

router.delete("/helperdelete/:id", deleteHelperById);


export default router;
