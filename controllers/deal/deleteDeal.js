// controllers/deal/deleteDeal.js
const Deal = require("../../models/Deal");
const { AppError, sendResponse } = require("../../helpers/utils");

const deleteDeal = async (req, res, next) => {
  try {
    if (!req.user || !["seller", "admin", "staff"].includes(req.user.role)) {
      throw new AppError(403, "You are not authorized to delete deals.");
    }
    const dealId = req.params.id;
    const deal = await Deal.findByIdAndDelete(dealId);
    if (!deal) {
      throw new AppError(404, "Deal not found.");
    }
    return sendResponse(res, 200, true, null, null, "Deal deleted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = deleteDeal;