const Banner = require("../../models/Banner");
const { sendResponse } = require("../../helpers/utils");

const deleteBanner = async (req, res, next) => {
  try {
    await Banner.findByIdAndDelete(req.params.id);
    return sendResponse(res, 200, true, null, null, "Xóa banner thành công");
  } catch (error) {
    next(error);
  }
};

module.exports = deleteBanner;