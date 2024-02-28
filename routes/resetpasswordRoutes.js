import express from "express";
import {
    otpsendUsername,
    verifyOtp,
    resetPassword,
    changePassword
} from "./controller/resetpasswordController.js";
const router = express.Router();

router.post("/otpsendusrname", otpsendUsername);

router.post("/verify-otp", verifyOtp);

router.post("/reset-password1", resetPassword);

router.post("/change-password", changePassword);



export default router;
