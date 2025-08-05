// File: controllers/SellerManager/getProductsByShopLevel.js

const Seller = require("../../models/Seller");
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const getProductsByShopLevel = async (req, res, next) => {
  try {
    const { level } = req.query;

    const allowedLevels = ["Shop Mall", "Chính Hãng", "Shop Giá Rẻ", "Shop Thường"];
    if (!level || !allowedLevels.includes(level)) {
      throw new AppError(400, "Invalid or missing shop level.");
    }

    // 🔍 Lấy tất cả seller thuộc level cần tìm
    const sellers = await Seller.find({ level }).select("_id").lean();
    const sellerIds = sellers.map(s => s._id);

    // 🔎 Tìm sản phẩm của các seller đó
    const products = await Product.find({ SellerID: { $in: sellerIds } }).lean();

    return sendResponse(res, 200, true, { products }, null, `Products from level '${level}' retrieved successfully.`);
  } catch (error) {
    console.error("🔥 getProductsByShopLevel Error:", error);
    next(error);
  }
};

module.exports = getProductsByShopLevel;