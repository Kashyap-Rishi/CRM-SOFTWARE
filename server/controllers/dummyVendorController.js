const axios = require("axios");
const CommunicationLog = require("../models/commLog");

const dummyVendor = async (req, res) => {
  try {
    const { campaignName, message } = req.body;

    const campaign = await CommunicationLog.findOne({ campaignName });
    if (!campaign) {
      return res.status(404).json({ error: "Campaign not found" });
    }

    const logId = campaign._id;

    const response = await axios.post(
      "http://localhost:8000/api/log/delivery-receipt",
      {
        logId,
        message,
      }
    );

    return res.status(200).json({
      message: "Message sent successfully",
      deliveryReceiptResponse: response.data,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

module.exports = dummyVendor;
