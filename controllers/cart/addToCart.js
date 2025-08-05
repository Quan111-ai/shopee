const mongoose = require("mongoose");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const addToCart = async (req, res, next) => {
  try {
    // 1. Kiểm tra authentication: đảm bảo req.user tồn tại
    if (!req.user || !req.user._id) {
      throw new AppError(401, "User not authenticated");
    }

    // 2. Lấy dữ liệu từ request body
    let { productId, quantity, selectedVariant } = req.body;
    if (!productId) {
      throw new AppError(400, "Product ID is required");
    }
    const trimmedProductId = productId.trim();
    if (!mongoose.Types.ObjectId.isValid(trimmedProductId)) {
      throw new AppError(400, "Invalid productId");
    }

    // Ép kiểu cho quantity đảm bảo là số dương
    quantity = Number(quantity);
    if (isNaN(quantity) || quantity <= 0) {
      throw new AppError(400, "Quantity must be a number greater than 0");
    }

    // 3. Truy vấn sản phẩm từ database, bao gồm cả thông tin danh mục
    const product = await Product.findById(trimmedProductId).populate("categoryID");
    if (!product) {
      throw new AppError(404, "Product not found");
    }

    // 4. Xử lý chọn variant (nếu sản phẩm có variant)
    let chosenVariant = null;
    let finalSelectedVariant = null;
    if (product.variants && product.variants.length > 0) {
      finalSelectedVariant =
        (selectedVariant && typeof selectedVariant === "string")
          ? selectedVariant.trim()
          : product.variants[0]._id.toString();
      chosenVariant = product.variants.find(v => v._id.toString() === finalSelectedVariant);
      if (!chosenVariant) {
        throw new AppError(400, "Invalid variant selection");
      }
    }

    // 5. Tạo đối tượng productData chứa thông tin cần lưu vào giỏ hàng
    const productData = {
      name: product.name,
      description: product.description,
      price: product.price,
      sellerID: product.sellerID,
      category: product.categoryID
        ? { _id: product.categoryID._id, name: product.categoryID.name }
        : null,
      imageURL: product.imageURL,
      quality: product.quality,
      variants: product.variants,
      activeDeals: product.activeDeals,
      appliedDealCode: product.appliedDealCode,
      selectedVariant: chosenVariant || null
    };

    // 6. Truy vấn giỏ hàng của người dùng hoặc tạo mới nếu chưa có
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      cart = new Cart({ userId: req.user._id, items: [] });
    }

    // 7. Kiểm tra xem sản phẩm (với variant nếu có) đã tồn tại trong giỏ chưa
    const existingItem = cart.items.find(item => {
      const sameProduct = item.productId.toString() === trimmedProductId;
      if (product.variants && product.variants.length > 0) {
        return (
          sameProduct &&
          item.productData.selectedVariant &&
          item.productData.selectedVariant._id &&
          item.productData.selectedVariant._id.toString() === finalSelectedVariant
        );
      }
      return sameProduct;
    });

    if (existingItem) {
      // Nếu sản phẩm đã có trong giỏ hàng, tăng số lượng
      existingItem.quantity += quantity;
      existingItem.productData = productData; // cập nhật thông tin sản phẩm mới nhất (nếu cần)
    } else {
      // Nếu chưa có, thêm sản phẩm mới vào giỏ
      cart.items.push({ productId: trimmedProductId, quantity, productData });
    }

    // 8. Lưu giỏ hàng vào database
    await cart.save();
    console.log("✅ Cart saved successfully:", cart);

    return sendResponse(res, 200, true, cart, null, "Product added to cart successfully.");
  } catch (error) {
    console.error("❌ Error in addToCart:", error);
    next(error);
  }
};

module.exports = addToCart;