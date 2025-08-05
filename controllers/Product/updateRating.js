// controllers/Product/updateRating.js
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const updateRating = async (req, res, next) => {
  try {
    const { productId, ratingId } = req.params;
    const { score, comment } = req.body;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) throw new AppError(404, "Product not found");

    const rating = product.rating.scores.id(ratingId);
    if (!rating) throw new AppError(404, "Rating not found");
    if (String(rating.userId) !== String(userId)) {
      throw new AppError(403, "You can only update your own rating");
    }

    if (score) rating.score = score;
    if (comment) rating.comment = comment;

    // Cập nhật lại average
    const allScores = product.rating.scores.map(r => r._id.equals(ratingId) ? score : r.score);
    product.rating.average = parseFloat((allScores.reduce((a, b) => a + b, 0) / product.rating.count).toFixed(1));

    await product.save();

    return sendResponse(res, 200, true, rating, null, "Rating updated.");
  } catch (error) {
    next(error);
  }
};

module.exports = updateRating;