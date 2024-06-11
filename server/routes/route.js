const express = require("express");
const orderRoutes = require("./order/orderRoutes.js");
const customerRoutes = require("./customer/customerRoutes.js");
const logRoutes = require("./commLog/logRoutes.js");

const router = express.Router();

router.use("/api/order", orderRoutes);
router.use("/api/customer", customerRoutes);
router.use("/api/log", logRoutes);

module.exports = router;
