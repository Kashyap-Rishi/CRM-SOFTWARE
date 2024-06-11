const consumeMessagesFromQueue = require("../message_broker/consumer/consumer");
const processCustomerMessage = require("../message_broker/consumer/customerConsumer");
const processOrderMessage = require("../message_broker/consumer/orderConsumer");
const connectToDatabase = require("./db");
const mongoose = require("mongoose");
const {
  processCommunicationLogMessage,
  processDeliveryReceiptMessage,
} = require("../message_broker/consumer/logConsumer");

function isDatabaseConnected() {
  return mongoose.connection.readyState === 1;
}

async function startConsumers() {
  if (!isDatabaseConnected()) {
    await connectToDatabase();
  }

  consumeMessagesFromQueue(
    "customerExchange",
    "customer_queue",
    "customer.*",
    processCustomerMessage
  );

  consumeMessagesFromQueue(
    "orderExchange",
    "order_queue",
    "order.*",
    processOrderMessage
  );

  consumeMessagesFromQueue(
    "logExchange",
    "communicationLog_queue",
    "log.*",
    processCommunicationLogMessage
  );

  consumeMessagesFromQueue(
    "deliveryReceiptExchange",
    "receipt_queue",
    "deliveryReceipt.*",
    processDeliveryReceiptMessage
  );
}

module.exports = startConsumers;
