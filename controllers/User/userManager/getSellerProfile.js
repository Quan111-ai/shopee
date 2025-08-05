// controllers/seller/getSellerProfile.js
const { AppError, sendResponse } = require("../../../helpers/utils");
const Seller = require("../../../models/Seller");
const Category = require("../../../models/Category"); // Import model Category

const getSellerProfile = async (req, res, next) => {
  try {
    // Giả sử middleware authentication đã lưu seller id vào req.user.id,
    // Nếu không, bạn có thể lấy nó từ req.params (ví dụ: req.params.sellerId)
    const sellerId = req.user ? req.user.id : req.params.sellerId;

    if (!sellerId) {
      throw new AppError(400, "Seller ID is required to fetch the profile.");
    }

    // Lấy thông tin seller
    const seller = await Seller.findById(sellerId).lean();
    if (!seller) {
      throw new AppError(404, "Seller not found.");
    }

    // Lấy danh sách các Category mà seller này đã tạo
    const categories = await Category.find({ sellerID: sellerId }).lean();

    // Ghép thông tin seller với danh sách category
    const sellerProfile = { ...seller, categories };

    return sendResponse(
      res,
      200,
      true,
      sellerProfile,
      null,
      "Seller profile retrieved successfully."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = getSellerProfile;