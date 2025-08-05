// File: controllers/category/createCategory.js
const Category = require("../../models/Category");
const Product = require("../../models/Product"); // Import model Product để lấy sản phẩm trong category
const { AppError, sendResponse } = require("../../helpers/utils");

const createCategory = async (req, res, next) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      throw new AppError(400, "Category name is required.");
    }

    if (!req.user || req.user.role !== "seller") {
      throw new AppError(403, "Only sellers can create categories.");
    }

    // Lấy sellerID từ token (sử dụng req.user._id, không dùng userId)
    const sellerID = req.user._id;

    // Tạo Category mới
    const newCategory = new Category({ name, description, sellerID });
    await newCategory.save();

    // Lấy danh sách sản phẩm có trong category này
    // Lưu ý: Trường `categoryID` trong Product trỏ về _id của Category
    const products = await Product.find({ categoryID: newCategory._id });

    // Tạo response object gồm thông tin category và danh sách sản phẩm liên quan.
    // Ví dụ, bạn có thể "gộp" thông tin sản phẩm vào trong object category trả về.
    const categoryWithProducts = { ...newCategory._doc, products };

    return sendResponse(
      res,
      201,
      true,
      categoryWithProducts,
      null,
      "Category created successfully."
    );
  } catch (error) {
    next(error);
  }
};

module.exports = createCategory;