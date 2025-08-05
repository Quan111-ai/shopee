const { sendResponse, AppError } = require("../../helpers/utils");
const Product = require("../../models/Product");

const getProductById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const product = await Product.findById(id)
      .populate("SellerID", "name storeName storeDescription followersCount") // ✅ sửa đúng tên field
      .populate("categoryID", "name")
      .populate("variants")
      .populate("activeDeals", "title discountPercentage startDate endDate");

    if (!product) {
      throw new AppError(404, "Product not found");
    }

    sendResponse(
      res,
      200,
      true,
      { product },
      null,
      "Get Product By ID Successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = getProductById;