const Deal = require("../models/Deal");

const applyDealToProduct = async (product) => {
  const now = new Date();

  // Tìm deal đang active cho sản phẩm đó
  const activeDeals = await Deal.find({
    productIDs: product._id,
    status: "active",
    startDate: { $lte: now },
    endDate: { $gte: now },
    quantity: { $gt: 0 },
  });

  if (!activeDeals || activeDeals.length === 0) return product;

  // Chọn deal có hiệu lực đầu tiên
  const deal = activeDeals[0]; // hoặc chọn deal có startDate gần nhất

  let discountedPrice = product.price;

  switch (deal.dealType) {
    case "percentage":
      discountedPrice = product.price * (1 - deal.discountPercentage / 100);
      break;

    case "fixedAmount":
      discountedPrice = Math.max(0, product.price - deal.fixedAmount);
      break;

    case "cheapest":
      discountedPrice = Math.max(0, product.price * 0.5); // giả định giảm 50%
      break;

    case "flash":
      discountedPrice = product.price * 0.9; // giả định giảm 10%
      break;
  }

  return {
    ...product._doc,
    appliedDealId: deal._id,
    appliedDealCode: deal.code || null,
    discountedPrice: Math.round(discountedPrice),
  };
};

module.exports = applyDealToProduct;