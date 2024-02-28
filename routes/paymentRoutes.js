import express from "express";
import {
    totalAmountsum,
    getPayment,
    sumMoney,
    updateAmounts,
    getAllPayment,
    sattlementRecords,
    getIdentities,
} from "./controller/paymentController.js";
const router = express.Router();

router.get("/totalAmountsum", totalAmountsum);

router.post("/payment", getPayment);

router.get("/summoney", sumMoney);

router.post("/updateAmount", updateAmounts);

router.get("/getpayment", getAllPayment);

router.get("/sattlementrecord", sattlementRecords);

router.get("/getidentities", getIdentities);


export default router;
