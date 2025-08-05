const Banner = require("../../models/Banner");
const { sendResponse } = require("../../helpers/utils");

const getAllBanner = async (req, res, next) => {
  try {
    const banners = await Banner.find(); // không lọc gì hết

    return sendResponse(
      res,
      200,
      true,
      {
        items: banners,
        count: banners.length,
        timestamp: new Date(),
        requestUrl: req.originalUrl
      },
      null,
      "Lấy tất cả banner thành công"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = getAllBanner;