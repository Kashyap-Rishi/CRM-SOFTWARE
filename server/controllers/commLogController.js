const { sendErrorResponse, sendSuccessResponse } = require("../utils/response");
const sendMessageToQueue = require("../message_broker/producer/producer");
const Customer = require("../models/customer");
const CommunicationLog = require("../models/commLog");
const { validateCommunicationLogData } = require("../utils/validation");

const findCustomersByRules = async (rules, logic) => {
  try {
    const query = constructQueryFromRules(rules, logic);
    const customers = await Customer.find(query);
    return customers;
  } catch (error) {
    console.error("Error finding customers by rules:", error.message);
    throw new Error("Failed to find customers based on rules");
  }
};

const constructQueryFromRules = (rules, logic) => {
  const query = {};

  if (logic === "AND") {
    const andConditions = [];

    rules.forEach((rule) => {
      const { field, operator, value } = rule;
      const condition = {};

      switch (operator) {
        case ">":
          condition[field] = { $gt: value };
          break;
        case "<":
          condition[field] = { $lt: value };
          break;
        case "=":
          condition[field] = value;
          break;
      }

      andConditions.push(condition);
    });

    Object.assign(query, ...andConditions);
  } else if (logic === "OR") {
    const orConditions = rules.map((rule) => {
      const { field, operator, value } = rule;
      const condition = {};

      switch (operator) {
        case ">":
          condition[field] = { $gt: value };
          break;
        case "<":
          condition[field] = { $lt: value };
          break;
        case "=":
          condition[field] = value;
          break;
      }

      return condition;
    });

    query["$or"] = orConditions;
  }

  return query;
};

const createCommunicationLog = async (req, res) => {
  try {
    const { campaignName, campaignDescription, rules, logic } = req.body;

    const customers = await findCustomersByRules(rules, logic);

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
