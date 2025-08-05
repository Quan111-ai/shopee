// controllers/ProductManager/rateProduct.js

const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const rateProduct = async (req, res, next) => {
  try {
    const { productId } = req.params;
    const { score, comment } = req.body;
    const userId = req.user._id; // cần middleware authenticate

    if (!productId || !score) {
      throw new AppError(400, "Product ID and score are required.");
    }
    if (score < 1 || score > 5) {
      throw new AppError(400, "Score must be between 1 and 5.");
    }

    const product = await Product.findById(productId);
    if (!product) {
      throw new AppError(404, "Product not found.");
    }

    // Check user đã đánh giá chưa (optional)
    const alreadyRated = product.rating.scores.find(s => String(s.userId) === String(userId));
    if (alreadyRated) {
      throw new AppError(400, "You already rated this product.");
    }

    // Push new rating
    product.rating.scores.push({ score, userId, comment });

    // Update average & count
    product.rating.count += 1;
    const totalScore = product.rating.scores.reduce((sum, r) => sum + r.score, 0);
    product.rating.average = parseFloat((totalScore / product.rating.count).toFixed(1));

    await product.save();

    return sendResponse(res, 200, true, product.rating, null, "Rating submitted successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = rateProduct;