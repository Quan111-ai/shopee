const CategoryGroup = require("../../models/CategoryGroup");
const Product = require("../../models/Product");
const { AppError, sendResponse } = require("../../helpers/utils");

const getProductsByCategoryGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await CategoryGroup.findById(id).populate("categories");

    if (!group) {
      throw new AppError(404, "Category group not found");
    }

    const categoryIDs = group.categories.map(c => c._id);
    const products = await Product.find({ categoryID: { $in: categoryIDs } });

    return sendResponse(res, 200, true, { group, products }, null, "Products fetched successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = getProductsByCategoryGroup;