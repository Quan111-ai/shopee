// controllers/pay/crud/getPayment.js
const Payment = require("d:/webb/backsau/models/Payment");
const { AppError } = require("d:/webb/backsau/helpers/utils");

const getPayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findById(id);
    if (!payment) return next(new AppError(404, "Payment not found"));
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(new AppError(500, "Failed to get payment"));
  }
};

module.exports = getPayment;