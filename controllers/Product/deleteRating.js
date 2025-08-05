// controllers/Product/deleteRating.js
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const deleteRating = async (req, res, next) => {
  try {
    const { productId, ratingId } = req.params;
    const userId = req.user._id;

    const product = await Product.findById(productId);
    if (!product) throw new AppError(404, "Product not found");

    const rating = product.rating.scores.id(ratingId);
    if (!rating) throw new AppError(404, "Rating not found");
    if (String(rating.userId) !== String(userId)) {
      throw new AppError(403, "You can only delete your own rating");
    }

    rating.remove();
    product.rating.count -= 1;

    if (product.rating.count === 0) {
      product.rating.average = 0;
    } else {
      const totalScore = product.rating.scores.reduce((sum, r) => sum + r.score, 0);
      product.rating.average = parseFloat((totalScore / product.rating.count).toFixed(1));
    }

    await product.save();

    return sendResponse(res, 200, true, null, null, "Rating deleted.");
  } catch (error) {
    next(error);
  }
};

module.exports = deleteRating;