// File: controllers/seller/getSeller.js
const mongoose = require("mongoose");
const Seller = require("../../models/Seller");
const Category = require("../../models/Category"); // Đảm bảo file schema Category đã tồn tại
const { AppError, sendResponse } = require("../../helpers/utils");

const getSeller = async (req, res, next) => {
  try {
    // Lấy SellerID từ URL parameter (sử dụng SellerID thay vì sellerId)
    const { SellerID } = req.params;

    if (!SellerID) {
      throw new AppError(400, "Seller ID is required.");
    }

    // Kiểm tra định dạng của SellerID
    if (!mongoose.Types.ObjectId.isValid(SellerID)) {
      throw new AppError(400, "Invalid Seller ID format.");
    }

    // Truy vấn Seller theo _id dựa trên SellerID
    const seller = await Seller.findById(SellerID)
      .select("userId name followers followersCount imageURL role isApproved storeName storeDescription ratings products createdAt updatedAt")
      .lean();

    // Nếu không tìm thấy seller, trả về seller: null và thông báo phù hợp
    if (!seller) {
      return sendResponse(
        res,
        200,
        true,
        { seller: null },
        null,
        "No additional seller information available for the given Seller ID."
      );
    }

    // Lấy danh sách Category mà seller này đã tạo
    const categories = await Category.find({ sellerID: SellerID }).lean();

    // Ghép seller với các category (thêm key `categories`)
    const sellerWithCategories = { ...seller, categories };

    // Trả về kết quả
    return sendResponse(
      res,
      200,
      true,
      { seller: sellerWithCategories },
      null,
      "Seller information retrieved successfully."
    );
  } catch (error) {
    console.error("Error retrieving seller information:", error);
    next(error);
  }
};

module.exports = getSeller;