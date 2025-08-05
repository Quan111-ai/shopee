const { AppError, sendResponse } = require("../../helpers/utils");
const Product = require("../../models/Product");
const Seller = require("../../models/Seller");

const createProduct = async (req, res, next) => {
  try {
    // ✅ Tự động ánh xạ dữ liệu từ Postman (Không cần chỉnh sửa key thủ công)
    const {
      title,
      Price,
      Description,
      categoryID,
      SellerID,
      Quality,
      variants,
      imageURL,
      gallery
    } = req.body;

    // ✅ Kiểm tra xem có thiếu trường bắt buộc không
    if (!title || Price == null || !SellerID || !Quality) {
      throw new AppError(400, "Missing required product information.");
    }

    // ✅ Kiểm tra seller tồn tại
    const seller = await Seller.findById(SellerID);
    if (!seller) {
      throw new AppError(400, "Seller not found or not authorized.");
    }

    // ✅ Nếu `variants` là string JSON từ Postman, parse nó thành mảng
    let parsedVariants = [];
    if (variants) {
      try {
        parsedVariants = typeof variants === "string" ? JSON.parse(variants) : variants;
      } catch (error) {
        throw new AppError(400, "Invalid variants format. Must be a valid JSON array.");
      }
    }

    // ✅ Tạo sản phẩm mà không cần ảnh lúc đầu
    const newProduct = new Product({
      name: title,
      description: Description || "",
      price: Price,
      sellerID: SellerID,
      categoryID: categoryID || null,
      quality: Quality,
      variants: parsedVariants,
      imageURL: imageURL || null, // ✅ Cho phép nhận URL ảnh nếu có
      gallery: gallery || [] // ✅ Cho phép nhận danh sách ảnh nếu có
    });

    await newProduct.save();

    // ✅ Cập nhật danh sách sản phẩm của seller
    seller.products.push(newProduct._id);
    await seller.save();

    return sendResponse(res, 201, true, newProduct, null, "Product created successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = createProduct;