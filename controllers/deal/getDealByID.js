// controllers/deal/getDealByID.js
const mongoose = require("mongoose");
const Deal = require("../../models/Deal");
const { AppError, sendResponse } = require("../../helpers/utils");

const getDealByID = async (req, res, next) => {
  try {
    const dealID = req.params.id;

    // Kiểm tra nếu dealID không hợp lệ (tránh lỗi MongoDB khi truy vấn)
    if (!mongoose.Types.ObjectId.isValid(dealID)) {
      throw new AppError(400, "Invalid deal ID format.");
    }

    const deal = await Deal.findById(dealID);
    if (!deal) {
      throw new AppError(404, "Deal not found.");
    }

    return sendResponse(res, 200, true, deal, null, "Deal retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = { getDealByID };