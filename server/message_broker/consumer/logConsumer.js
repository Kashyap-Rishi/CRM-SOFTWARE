const CommunicationLog = require("../../models/commLog");

async function processCommunicationLogMessage(data) {
  

  console.log("Processing Communication Log Message:", data);
  try {
    const { campaignName, campaignDescription, campaignSize, rules, logic, customers, campaignStatus } = data;

    if (!Array.isArray(customers)) {
      throw new Error("Expected customers to be an array");
    }

    const customerEntries = customers.map(customer => ({
      customer: customer.customer,
      status: customer.status
    }));

    const communicationLogData = {
      campaignName,
      campaignDescription,
      campaignSize,
      rules,
      logic,
      customers: customerEntries,
      campaignStatus
    };
    console.log(communicationLogData)
    const communicationLog = new CommunicationLog(communicationLogData);
    await communicationLog.save();

    console.log(" [x] Saved communication log:", communicationLog);
    
  } catch (error) {
    console.error("Error processing communication log message:", error);
  }
}

async function processDeliveryReceiptMessage(data) {

  console.log("Processing Delivery Receipt Message:", data);
  try {
    const { customerId, logId, deliveryStatus } = data;

    const communicationLog = await CommunicationLog.findById(logId);

    if (!communicationLog) {
      console.error(`Communication log with ID ${logId} not found`);
      return;
    }

    const customer = communicationLog.customers.find(c => c.customer.toString() === customerId);
    if (!customer) {
      console.error(`Customer with ID ${customerId} not found in communication log ${logId}`);
      return;
    }

    customer.status = deliveryStatus;
    communicationLog.campaignStatus='SENT';

    await communicationLog.save();

    console.log(`Updated status for customer ${customerId} to ${deliveryStatus}`);
    

  } catch (error) {
    console.error('Error processing delivery receipt message:', error);
  }
}

module.exports = { processCommunicationLogMessage, processDeliveryReceiptMessage };

