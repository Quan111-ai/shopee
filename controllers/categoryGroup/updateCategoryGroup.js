const CategoryGroup = require("../../models/CategoryGroup");
const Category = require("../../models/Category");
const { sendResponse, AppError } = require("../../helpers/utils");

const updateCategoryGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, description, categoryIDs } = req.body;

    const group = await CategoryGroup.findById(id);
    if (!group) {
      throw new AppError(404, "Category group not found");
    }

    if (categoryIDs) {
      const validCategories = await Category.find({ _id: { $in: categoryIDs } });
      if (validCategories.length !== categoryIDs.length) {
        throw new AppError(400, "Some categoryIDs are invalid");
      }
      group.categories = categoryIDs;
    }

    if (name) {
      group.name = name;
      group.slug = name.toLowerCase().replace(/\s+/g, "-");
    }

    if (description !== undefined) {
      group.description = description;
    }

    await group.save();
    return sendResponse(res, 200, true, group, null, "Category group updated");
  } catch (err) {
    next(err);
  }
};

module.exports = updateCategoryGroup;