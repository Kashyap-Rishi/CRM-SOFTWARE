const express = require("express");
const {createCommunicationLog,fetchAllCommunicationLog} = require("../../controllers/commLogController");
const deliveryReceipt = require("../../controllers/deliveryReceiptController");
const dummyVendor= require("../../controllers/dummyVendorController");


const router=express.Router();

router.post("/create-log",createCommunicationLog);
router.post("/template",dummyVendor);
router.post("/delivery-receipt",deliveryReceipt);
router.get("/fetch-log",fetchAllCommunicationLog)


module.exports= router;