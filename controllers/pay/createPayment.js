// controllers/pay/crud/createPayment.js
const Payment = require("d:/webb/backsau/models/Payment");
const { AppError } = require("d:/webb/backsau/helpers/utils");

const createPayment = async (req, res, next) => {
  try {
    const { orderId, amount, currency } = req.body;
    const newPayment = await Payment.create({ orderId, amount, currency });
    res.status(201).json({ success: true, data: newPayment });
  } catch (error) {
    next(new AppError(500, "Failed to create payment"));
  }
};

module.exports = createPayment;