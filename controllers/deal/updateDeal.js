// controllers/deal/updateDeal.js
const Deal = require("../../models/Deal");
const { AppError, sendResponse } = require("../../helpers/utils");

const updateDeal = async (req, res, next) => {
  try {
    if (!req.user || !["seller", "admin", "staff"].includes(req.user.role)) {
      throw new AppError(403, "You are not authorized to update deals.");
    }
    const dealId = req.params.id;
    const updateData = req.body;
    
    // Kiểm tra hợp lệ khoảng thời gian nếu được cập nhật
    if (updateData.startDate && updateData.endDate && new Date(updateData.startDate) >= new Date(updateData.endDate)) {
      throw new AppError(400, "Start date must be before End date.");
    }
    
    const updatedDeal = await Deal.findByIdAndUpdate(dealId, updateData, { new: true, runValidators: true });
    if (!updatedDeal) {
      throw new AppError(404, "Deal not found.");
    }
    return sendResponse(res, 200, true, updatedDeal, null, "Deal updated successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = updateDeal;