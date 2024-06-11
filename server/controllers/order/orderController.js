const { validateOrderData } = require("../../utils/validation");
const { sendErrorResponse, sendSuccessResponse } = require("../../utils/response");
const sendMessageToQueue = require("../../message_broker/producer/producer");

const createOrder = async (req, res) => {
  try {
    const errors = validateOrderData(req.body);

    if (errors.length > 0) {
      return sendErrorResponse(res, 400, errors.join(", "));
    }

    const { customerId, products, totalAmount } = req.body;
    const orderData = { customerId, products, totalAmount };

    await sendMessageToQueue("orderExchange","order.create", orderData);
    sendSuccessResponse(res, 201, "Order data sent for processing");
  } catch (error) {
    console.error("Error creating order:", error.message);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

module.exports = createOrder;
