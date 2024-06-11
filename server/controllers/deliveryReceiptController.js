const CommunicationLog = require("../models/commLog");
const sendMessageToQueue = require("../message_broker/producer/producer");

const deliveryReceipt = async (req, res) => {
  try {
    const { logId, message } = req.body;

    const communicationLog = await CommunicationLog.findById(logId);
    if (!communicationLog) {
      return res.status(404).json({ error: "Communication log not found" });
    }
    for (const customer of communicationLog.customers) {
      const deliveryStatus = Math.random() < 0.6 ? "SUCCESS" : "FAILED";
      await sendMessageToQueue(
        "deliveryReceiptExchange",
        "deliveryReceipt.create",
        {
          customerId: customer.customer,
          logId,
          deliveryStatus,
          message,
        }
      );
    }

    return res.status(200).json({ message: "Delivery receipt processed" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = deliveryReceipt;
