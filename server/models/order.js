const mongoose = require("mongoose");
const updateCustomerTotalSpends = require("../middleware/orderSum");

const orderSchema = new mongoose.Schema({
  customerId: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  products: [{ 
    name: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
  }],
  totalAmount: { type: Number, required: true },
  orderDate: { type: Date, default: Date.now },
});

orderSchema.post('save', updateCustomerTotalSpends);

module.exports = mongoose.model("Order", orderSchema);