const CategoryGroup = require("../../models/CategoryGroup");
const { sendResponse, AppError } = require("../../helpers/utils");

const getCategoryGroups = async (req, res, next) => {
  try {
    const groups = await CategoryGroup.find().populate("categories");
    return sendResponse(res, 200, true, groups, null, "Fetched all category groups");
  } catch (err) {
    next(err);
  }
};

module.exports = getCategoryGroups;