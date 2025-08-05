const { sendResponse, AppError } = require("../../helpers/utils");
const Product = require("../../models/Product");

const getAllProducts = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit) || 100;
    const page = parseInt(req.query.page) || 1;
    const skip = (page - 1) * limit;

    const sortBy = req.query.sortBy || "createdAt";
    const order = req.query.order === "desc" ? -1 : 1;

    const validSortFields = ["createdAt", "price", "sold"];
    if (!validSortFields.includes(sortBy)) {
      return sendResponse(res, 400, false, null, null, "Invalid sort field");
    }

    const products = await Product.find()
      .populate("SellerID") // ✅ đúng với tên trong Product.js
      .populate("activeDeals", "title discountPercentage startDate endDate")
      .sort({ [sortBy]: order })
      .skip(skip)
      .limit(limit)
      .exec();

    const totalProducts = await Product.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    sendResponse(
      res,
      200,
      true,
      {
        products,
        pagination: {
          page,
          limit,
          totalPages,
          totalProducts,
        },
      },
      null,
      "Lấy danh sách sản phẩm thành công"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = getAllProducts;