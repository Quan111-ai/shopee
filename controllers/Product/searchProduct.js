const { AppError, sendResponse } = require("../../helpers/utils");
const Product = require("../../models/Product");
const Seller = require("../../models/Seller");
const searchProductSchema = require("../src/productSchemaValidator/searchProductSchema"); // ✅ kiểm tra đường dẫn này đúng với cấu trúc project của thầy

const searchProducts = async (req, res, next) => {
  // ✅ Validate input bằng schema
  const { error } = searchProductSchema.validate(req.query, { abortEarly: false });
  if (error) {
    const message = error.details.map(d => d.message).join(", ");
    return next(new AppError(400, message));
  }

  const {
    keyword,
    name,
    title,
    categoryID,
    sellerID,
    minPrice,
    maxPrice,
    Quality,
    status,
    page = 1,
    limit = 20,
  } = req.query;

  try {
    const searchText = keyword || name || title || "";
    const regex = { $regex: searchText, $options: "i" };

    const productConditions = [];
    const sellerConditions = [];

    if (searchText) {
      productConditions.push({ title: regex });
      productConditions.push({ description: regex });
      productConditions.push({ name: regex });
      productConditions.push({ Quality: regex });

      sellerConditions.push({ username: regex });
      sellerConditions.push({ email: regex });
      sellerConditions.push({ storeName: regex });         // ✅ sửa từ shopName → storeName
      sellerConditions.push({ storeDescription: regex });
    }

    const productFilter = productConditions.length > 0 ? { $or: productConditions } : {};
    if (categoryID) productFilter.categoryID = categoryID;
    if (sellerID) productFilter.SellerID = sellerID;
    if (minPrice) productFilter.price = { ...productFilter.price, $gte: parseFloat(minPrice) };
    if (maxPrice) productFilter.price = { ...productFilter.price, $lte: parseFloat(maxPrice) };
    if (Quality) productFilter.Quality = Quality;
    if (status) productFilter.status = status;

    const skip = (page - 1) * limit;

    // 🧦 Truy vấn sản phẩm
    const products = await Product.find(productFilter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ createdAt: -1 })
      .populate("SellerID")
      .exec();

    const totalProducts = await Product.countDocuments(productFilter);
    const totalPages = Math.ceil(totalProducts / limit);

    // 🧑‍💼 Truy vấn người bán
    const sellerFilter = sellerConditions.length > 0 ? { $or: sellerConditions } : {};
    const sellers = await Seller.find(sellerFilter).limit(10);

    // ✅ Trả về kết quả gộp
    sendResponse(
      res,
      200,
      true,
      {
        products,
        sellers,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          totalPages,
          totalProducts,
        },
      },
      null,
      "Tìm kiếm toàn hệ thống thành công!"
    );
  } catch (err) {
    next(err);
  }
};

module.exports = searchProducts;