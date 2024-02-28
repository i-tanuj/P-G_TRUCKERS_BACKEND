import express from "express";
import {
    getNotifications,
    insertNotifications,
} from "./controller/notificationController.js";
const router = express.Router();

router.get("/getnotifications", getNotifications);

router.post("/insertNotification", insertNotifications);



export default router;
