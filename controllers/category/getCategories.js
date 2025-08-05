const mongoose = require("mongoose");
const Category = require("../../models/Category");
const { AppError, sendResponse } = require("../../helpers/utils");

const getCategories = async (req, res, next) => {
  try {
    // Tìm tất cả các category và populate thông tin seller theo sellerID (chỉ lấy các trường cần thiết)
    const categories = await Category.find({})
      .populate("sellerID", "storeName username email") // Chỉ lấy các trường: storeName, username, email từ seller
      .lean();

    return sendResponse(
      res,
      200,
      true,
      categories,
      null,
      "Categories retrieved successfully."
    );
  } catch (error) {
    next(error);
  }
};

const getCategoryById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid Category ID.");
    }
    // Tìm category theo ID và populate thông tin seller
    const category = await Category.findById(id)
      .populate("sellerID", "storeName username email")
      .lean();

    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    // Cho phép mọi người truy cập chi tiết của category
    return sendResponse(
      res,
      200,
      true,
      category,
      null,
      "Category retrieved successfully."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = { getCategories, getCategoryById };