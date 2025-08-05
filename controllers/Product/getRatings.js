// controllers/Product/getRatings.js
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const getRatings = async (req, res, next) => {
  try {
    const { productId } = req.params;

    const product = await Product.findById(productId).select("rating").lean();
    if (!product) throw new AppError(404, "Product not found");

    return sendResponse(res, 200, true, product.rating, null, "Ratings fetched successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = getRatings;