// controllers/deal/assignDeal.js
const Deal = require("../../models/Deal");
const User = require("../../models/User");
const { AppError, sendResponse } = require("../../helpers/utils");

const assignDealToUser = async (req, res, next) => {
  try {
    if (!req.user || !["seller", "admin", "staff"].includes(req.user.role)) {
      throw new AppError(403, "You are not authorized to assign deals.");
    }
    
    const dealId = req.params.id;
    const { userId } = req.body; // ID người dùng được gán deal
    const deal = await Deal.findById(dealId);
    if (!deal) {
      throw new AppError(404, "Deal not found.");
    }
    
    const dealEntry = {
      dealId: deal._id,
      appliedAt: new Date(),
      productID: deal.productID,
    };
    
    await User.findByIdAndUpdate(userId, { $push: { ownedDeals: dealEntry } });
    return sendResponse(res, 200, true, null, null, "Deal assigned to user successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = assignDealToUser;