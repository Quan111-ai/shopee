const Banner = require("../../models/Banner");
const { sendResponse } = require("../../helpers/utils");

const createBanner = async (req, res, next) => {
  try {
    const {
      title,
      imageUrl,
      redirectUrl,
      isDisplayed
    } = req.body;

    const banner = await Banner.create({
      title,
      imageUrl,
      redirectUrl,
      isDisplayed: isDisplayed ?? false // mặc định là false nếu không truyền
    });

    return sendResponse(
      res,
      201,
      true,
      banner,
      null,
      "Tạo banner thành công"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = createBanner;