const Banner = require("../../models/Banner");
const { sendResponse } = require("../../helpers/utils");

const updateBanner = async (req, res, next) => {
  try {
    const updated = await Banner.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });

    return sendResponse(res, 200, true, updated, null, "Cập nhật banner thành công");
  } catch (error) {
    next(error);
  }
};

module.exports = updateBanner;