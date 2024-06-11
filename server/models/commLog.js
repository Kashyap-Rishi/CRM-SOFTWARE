const mongoose = require("mongoose");

const customerStatusSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: "Customer", required: true },
  status: { type: String, enum: ["PENDING", "SUCCESS", "FAILED"], default: "PENDING" }
});

const communicationLogSchema = new mongoose.Schema({
  campaignName: { type: String, required: true,unique:true },
  campaignDescription: { type: String },
  campaignSize: { type: Number, required: true },
  rules: [{ field: String, operator: String, value: mongoose.Schema.Types.Mixed }],
  logic: { type: String, enum: ["AND", "OR"], required: true },
  createdAt: { type: Date, default: Date.now },
  customers: [customerStatusSchema],
  campaignStatus:{ type: String, enum: ["PENDING", "SENT", "FAILED"], default: "PENDING" }
});

module.exports = mongoose.model("CommunicationLog", communicationLogSchema);