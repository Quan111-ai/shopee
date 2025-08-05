const CategoryGroup = require("../../models/CategoryGroup");
const { sendResponse, AppError } = require("../../helpers/utils");

const deleteCategoryGroup = async (req, res, next) => {
  try {
    const { id } = req.params;
    const group = await CategoryGroup.findByIdAndDelete(id);
    if (!group) {
      throw new AppError(404, "Category group not found");
    }
    return sendResponse(res, 200, true, null, null, "Category group deleted successfully");
  } catch (err) {
    next(err);
  }
};

module.exports = deleteCategoryGroup;