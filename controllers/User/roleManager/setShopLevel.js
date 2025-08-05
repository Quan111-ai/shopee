const { AppError, sendResponse } = require("../../../helpers/utils");
const Seller = require("../../../models/Seller");

const setShopLevel = async (req, res, next) => {
  try {
    const { SellerID } = req.params; // lấy sellerId từ URL

    const { newLevel } = req.body;

    // ✅ Kiểm tra phân quyền — chỉ admin hoặc staff mới được gán cấp
    if (!req.user || !["admin", "staff"].includes(req.user.role)) {
      throw new AppError(403, "Access denied. Only admins or staff can set shop level.");
    }

    // ✅ Kiểm tra dữ liệu đầu vào
    if (!SellerID || !newLevel) {
      throw new AppError(400, "SellerID and newLevel are required.");
    }

    // ✅ Validate cấp độ hợp lệ
    const allowedLevels = ["Shop Mall", "Chính Hãng", "Shop Giá Rẻ", "Shop Thường"];
    if (!allowedLevels.includes(newLevel)) {
      throw new AppError(400, "Invalid shop level provided.");
    }

    // ✅ Truy vấn và cập nhật Seller
    const seller = await Seller.findById(SellerID);
    if (!seller) {
      throw new AppError(404, "Seller not found.");
    }

    seller.level = newLevel;
    await seller.save();

    return sendResponse(res, 200, true, seller, null, `Shop level updated to ${newLevel} successfully.`);
  } catch (error) {
    console.error("🔥 setShopLevel Error:", error);
    next(error);
  }
};

module.exports = setShopLevel;