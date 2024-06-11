const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");
const sendMessageToQueue = require("../message_broker/producer/producer");
const Customer = require("../models/customer");
const CommunicationLog = require("../models/commLog");
const { validateCommunicationLogData } = require("../utils/validation");

const findCustomersByRules = async (rules) => {
  try {
    const query = constructQueryFromRules(rules);
    const customers = await Customer.find(query);
    return customers;
  } catch (error) {
    console.error("Error finding customers by rules:", error.message);
    throw new Error("Failed to find customers based on rules");
  }
};

const constructQueryFromRules = (rules) => {
  const query = {};

  rules.forEach((rule) => {
    const { field, operator, value } = rule;

    switch (operator) {
      case ">":
        query[field] = { $gt: value };
        break;
      case "<":
        query[field] = { $lt: value };
        break;
      case "=":
        query[field] = value;
        break;
    }
  });

  return query;
};

const createCommunicationLog = async (req, res) => {
  try {
    const { campaignName, campaignDescription, rules, logic } = req.body;

    const customers = await findCustomersByRules(rules);

    const campaignSize = customers.length;

    const customerEntries = customers.map((customer) => ({
      customer: customer._id,
      status: "PENDING",
    }));

    const communicationLogData = {
      campaignName,
      campaignDescription,
      campaignSize,
      rules,
      logic,
      customers: customerEntries,
      campaignStatus: "PENDING",
    };

    const errors = validateCommunicationLogData(communicationLogData);
    if (errors.length > 0) {
      return sendErrorResponse(res, 400, errors.join(", "));
    }
    await sendMessageToQueue("logExchange", "log.create", communicationLogData);

    sendSuccessResponse(res, 201, campaignSize);
  } catch (error) {
    console.error("Error creating communication log:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

const fetchAllCommunicationLog = async (req, res) => {
  try {
    const communicationLogs = await CommunicationLog.find();

    sendSuccessResponse(res, 200, communicationLogs);
  } catch (error) {
    console.error("Error fetching communication logs:", error);
    sendErrorResponse(res, 500, "Internal server error");
  }
};

module.exports = { createCommunicationLog, fetchAllCommunicationLog };
