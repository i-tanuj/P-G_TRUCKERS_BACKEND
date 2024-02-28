import express from "express";
import {
    changePassword,
} from "./controller/changepasswordController.js";
const router = express.Router();

router.post("/change-password", changePassword);


export default router;
