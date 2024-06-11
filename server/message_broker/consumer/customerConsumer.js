const Customer = require("../../models/customer");

async function processCustomerMessage(data) {
  try {
    const { name, email, totalSpends, maxVisits, lastVisit } = data;
    const customer = new Customer({ name, email, totalSpends, maxVisits, lastVisit });
    await customer.save();
    console.log(" [x] Saved customer:", customer);
  } catch (error) {
    console.error("Error processing customer message:", error);
  }
}
module.exports = processCustomerMessage;
