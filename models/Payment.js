// models/Payment.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const paymentSchema = new Schema({
  orderId: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, required: true },
  status: { type: String, default: "pending" }, // pending, succeeded, failed
  createdAt: { type: Date, default: Date.now }
});

const Payment = mongoose.model("Payment", paymentSchema);
module.exports = Payment;