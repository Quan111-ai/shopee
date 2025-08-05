
const CategoryGroup = require("../../models/CategoryGroup");
const { sendResponse, AppError } = require("../../helpers/utils");

const getCategoryGroupById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await CategoryGroup.findById(id).populate("categories");
    if (!group) {
      throw new AppError(404, "Category group not found");
    }
    return sendResponse(res, 200, true, group, null, "Fetched category group");
  } catch (err) {
    next(err);
  }
};

module.exports = getCategoryGroupById;