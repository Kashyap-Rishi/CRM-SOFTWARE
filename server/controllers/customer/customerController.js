const { validateCustomerData } = require("../../utils/validation");
const { sendErrorResponse, sendSuccessResponse } = require("../../utils/response");
const sendMessageToQueue = require("../../message_broker/producer/producer");
const Customer = require("../../models/customer");

const createCustomer = async (req, res) => {
  try {
    const errors = validateCustomerData(req.body);

    if (errors.length > 0) {
      return sendErrorResponse(res, 400, errors.join(", "));
    }

    const { name, email, totalSpends, maxVisits, lastVisit } = req.body;
    const customerData = { name, email, totalSpends, maxVisits, lastVisit };
    console.log(customerData);
   
    await sendMessageToQueue("customerExchange","customer.create", customerData);
    sendSuccessResponse(res, 201, "Customer data sent for processing");
  } catch (error) {
    console.error("Error creating customer:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};


const fetchAllCustomer = async (req, res) => {
  try {
    const customers = await Customer.find();

    sendSuccessResponse(res, 200,customers);
  } catch (error) {
    console.error("Error fetching customers:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};


module.exports = {createCustomer,fetchAllCustomer};
