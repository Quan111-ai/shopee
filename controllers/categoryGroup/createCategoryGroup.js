const CategoryGroup = require("../../models/CategoryGroup");
const Category = require("../../models/Category");
const { AppError, sendResponse } = require("../../helpers/utils");

const createCategoryGroup = async (req, res, next) => {
  try {
    const { name, description, categoryIDs } = req.body;
    if (!name || !Array.isArray(categoryIDs) || categoryIDs.length === 0) {
      throw new AppError(400, "Missing required fields: name, categoryIDs[]");
    }

    if (!req.user || !["admin", "staff"].includes(req.user.role)) {
      throw new AppError(403, "Only admin or staff can create category groups");
    }

    const validCategories = await Category.find({ _id: { $in: categoryIDs } });
    if (validCategories.length !== categoryIDs.length) {
      throw new AppError(400, "Some categoryIDs are invalid");
    }

    const newGroup = new CategoryGroup({
      name,
      slug: name.toLowerCase().replace(/\s+/g, "-"),
      description,
      categories: categoryIDs,
      createdBy: req.user._id,
    });

    await newGroup.save();
    return sendResponse(res, 201, true, newGroup, null, "Category group created successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = createCategoryGroup;