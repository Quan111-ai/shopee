// File: controllers/Product/deleteProduct.js

const Product = require("../../models/Product");

const deleteProduct = async (req, res, next) => {
  try {
    const productId = req.params.id;  // lấy id sản phẩm từ URL params

    // Tìm và xóa sản phẩm theo id
    const deletedProduct = await Product.findByIdAndDelete(productId);

    if (!deletedProduct) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    return res.status(200).json({
      success: true,
      message: "Product deleted successfully"
    });
  } catch (error) {
    console.error("Error deleting product:", error);
    next(error);
  }
};

module.exports = deleteProduct;