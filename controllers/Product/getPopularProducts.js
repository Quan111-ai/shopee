const { AppError, sendResponse } = require("../../helpers/utils");
const Product = require("../../models/Product");

const getPopularProducts = async (req, res, next) => {
  try {
    const {
      categoryID,
      sellerID,
      status,
      minPrice,
      maxPrice,
      limit = 20,
      sortBy = "searchCount", // 👈 mặc định sắp theo searchCount
    } = req.query;

    const filter = {
      [sortBy]: { $gte: 1 }, // ✅ có ít nhất 1 lượt
    };

    if (categoryID) filter.categoryID = categoryID;
    if (sellerID) filter.SellerID = sellerID;
    if (status) filter.status = status;
    if (minPrice) filter.price = { ...filter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) filter.price = { ...filter.price, $lte: parseFloat(maxPrice) };

    const products = await Product.find(filter)
      .sort({ [sortBy]: -1 }) // ✅ sắp xếp giảm dần theo độ phổ biến
      .limit(parseInt(limit))
      .populate("SellerID")
      .exec();

    sendResponse(
      res,
      200,
      true,
      { products },
      null,
      "Lấy sản phẩm phổ biến thành công!"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = getPopularProducts;