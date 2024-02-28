import express from "express";
import {
    getDispatcher,
    updateDispatcherById,
    addDispatcher,
    deleteDispatcherById,
} from "./controller/dispatcherController.js";
const router = express.Router();

router.delete("dispatcherdelete/:id", deleteDispatcherById);
router.get("/dispatcher", getDispatcher);
router.post("/addispatcher", addDispatcher);
router.put("/updatedispatchersby/:id", updateDispatcherById);


export default router;
