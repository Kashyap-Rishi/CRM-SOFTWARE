const mongoose = require("mongoose");

const updateCustomerTotalSpends = async function (doc) {
  try {
    const customerId = doc.customerId;

    const objectIdCustomerId = new mongoose.Types.ObjectId(customerId);

    const orders = await mongoose
      .model("Order")
      .aggregate([
        { $match: { customerId: objectIdCustomerId } },
        {
          $group: { _id: "$customerId", totalSpends: { $sum: "$totalAmount" } },
        },
      ]);

    const totalSpends = orders[0] ? orders[0].totalSpends : 0;

    await mongoose
      .model("Customer")
      .findByIdAndUpdate(customerId, { totalSpends }, { new: true });
  } catch (error) {
    console.error("Error updating totalSpends for customer:", error);
  }
};

module.exports = updateCustomerTotalSpends;
