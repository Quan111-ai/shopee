const mongoose = require("mongoose");
const Category = require("../../models/Category");
const { AppError, sendResponse } = require("../../helpers/utils");

const updateCategory = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      throw new AppError(400, "Invalid Category ID.");
    }

    const category = await Category.findById(id);
    if (!category) {
      throw new AppError(404, "Category not found.");
    }

    // ✅ Kiểm tra quyền update nếu là seller
    if (
      req.user &&
      req.user.role === "seller" &&
      category.sellerID?.toString() !== req.user.userId
    ) {
      throw new AppError(403, "You are not authorized to update this category.");
    }

    const { name, description, icon } = req.body;

    // ✅ Cập nhật từng trường nếu có
    category.name = name || category.name;
    category.description = description || category.description;
    category.icon = icon || category.icon; // 👈 cập nhật icon mới nếu có

    await category.save();

    return sendResponse(
      res,
      200,
      true,
      category,
      null,
      "Category updated successfully."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = updateCategory;