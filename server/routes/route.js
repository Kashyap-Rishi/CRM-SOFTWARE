const express = require("express");
const orderRoutes = require("./order/orderRoutes.js");
const customerRoutes = require("./customer/customerRoutes.js");
const logRoutes = require("./commLog/logRoutes.js");
const projectRoutes = require("./project/projectRoutes.js");
const userRoutes = require("./user/userRoutes.js");

const router = express.Router();

router.use("/api/order", orderRoutes);
router.use("/api/customer", customerRoutes);
router.use("/api/user", userRoutes);
router.use("/api/log", logRoutes);
router.use("/api/project",projectRoutes)




module.exports = router;
