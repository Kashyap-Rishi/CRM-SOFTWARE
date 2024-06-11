const express = require("express");
const {
  createCustomer,
  fetchAllCustomer,
} = require("../../controllers/customer/customerController");

const router = express.Router();

router.post("/create-customer", createCustomer);
router.get("/fetch-customer", fetchAllCustomer);

module.exports = router;
