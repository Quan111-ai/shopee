// controllers/pay/crud/updatePayment.js
const Payment = require("d:/webb/backsau/models/Payment");
const { AppError } = require("d:/webb/backsau/helpers/utils");

const updatePayment = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const payment = await Payment.findByIdAndUpdate(
      id,
      { status },
      { new: true, runValidators: true }
    );
    if (!payment) return next(new AppError(404, "Payment not found"));
    res.status(200).json({ success: true, data: payment });
  } catch (error) {
    next(new AppError(500, "Failed to update payment"));
  }
};

module.exports = updatePayment;