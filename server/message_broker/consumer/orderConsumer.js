const Order = require("../../models/order");

async function processOrderMessage(data) {
  try {
    const { customerId, products, totalAmount } = data;
    const order = new Order({ customerId, products, totalAmount });
    await order.save();
    console.log(" [x] Saved order:", order);
  } catch (error) {
    console.error("Error processing order message:", error.message);
  }
}

module.exports = processOrderMessage;
