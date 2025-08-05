// controllers/pay/crud/deletePayment.js
const Payment = require("d:/webb/backsau/models/Payment");
const { AppError } = require("d:/webb/backsau/helpers/utils");

const deletePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const payment = await Payment.findByIdAndDelete(id);
    if (!payment) return next(new AppError(404, "Payment not found"));
    res.status(200).json({ success: true, message: "Payment deleted" });
  } catch (error) {
    next(new AppError(500, "Failed to delete payment"));
  }
};

module.exports = deletePayment;