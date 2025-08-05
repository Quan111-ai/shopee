// File: controllers/category/deleteCategory.js
const mongoose = require("mongoose");
const Category = require("../../models/Category");
const { AppError, sendResponse } = require("../../helpers/utils");

const deleteCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid Category ID.");
    }
    const category = await Category.findById(id);
    if (!category) {
      throw new AppError(404, "Category not found.");
    }
    if (req.user && req.user.role === "seller" && category.sellerID.toString() !== req.user.userId) {
      throw new AppError(403, "You are not authorized to delete this category.");
    }
    const deletedCategory = await Category.findByIdAndDelete(id).lean();
    return sendResponse(
      res,
      200,
      true,
      deletedCategory,
      null,
      "Category deleted successfully."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = deleteCategory;