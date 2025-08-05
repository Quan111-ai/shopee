const Deal = require("../../models/Deal");
const User = require("../../models/User");
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const applyDeal = async (req, res, next) => {
  try {
    const dealId = req.params.id;
    const deal = await Deal.findById(dealId);
    if (!deal) throw new AppError(404, "Deal not found.");

    if (deal.status !== "active") {
      throw new AppError(400, "Deal is not active. Please activate the deal first.");
    }

    const now = new Date();
    if (now < deal.startDate || now > deal.endDate) {
      throw new AppError(400, "Deal is not in its active time window.");
    }

    if (deal.quantity <= 0) {
      throw new AppError(400, "Deal is out of stock.");
    }

    const user = req.user;
    if (!user) throw new AppError(401, "User not authenticated.");
    if (!deal.eligibleRanks.includes(user.rank)) {
      throw new AppError(403, "Your rank is not eligible for this deal.");
    }

    // Cập nhật số lượng tồn
    deal.quantity -= 1;
    await deal.save();

    // Ghi nhận deal đã dùng
    const dealEntry = {
      dealId: deal._id,
      appliedAt: now,
      productIDs: deal.productIDs,
      code: deal.code || null,
    };
    await User.findByIdAndUpdate(user._id, { $push: { ownedDeals: dealEntry } });

    // Áp dụng hiệu ứng deal theo loại
    let appliedDetails = [];

    for (let prodId of deal.productIDs) {
      const product = await Product.findById(prodId);
      if (!product) continue;

      let newPrice = product.price;

      switch (deal.dealType) {
        case "percentage":
          newPrice = product.price * (1 - deal.discountPercentage / 100);
          break;
        case "fixedAmount":
          newPrice = Math.max(0, product.price - deal.fixedAmount);
          break;
        case "cheapest":
          newPrice = Math.max(0, product.price * 0.5); // giả sử giảm 50% cho sản phẩm rẻ nhất
          break;
        case "flash":
          newPrice = product.price * 0.9; // giả sử giảm 10% trong thời gian ngắn
          break;
      }

      await Product.findByIdAndUpdate(prodId, {
        appliedDealCode: deal.code || null,
        discountedPrice: Math.round(newPrice),
      });

      appliedDetails.push({
        productId: prodId,
        originalPrice: product.price,
        discountedPrice: Math.round(newPrice),
      });
    }

    return sendResponse(
      res,
      200,
      true,
      { deal, appliedDetails },
      null,
      "Deal applied successfully."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = applyDeal;