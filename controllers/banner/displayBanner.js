const Banner = require("../../models/Banner");
const { sendResponse } = require("../../helpers/utils");

const displayBanner = async (req, res, next) => {
  try {
    const { bannerId } = req.params;
    const { isDisplayed } = req.body;

    if (typeof isDisplayed !== "boolean") {
      return sendResponse(
        res,
        400,
        false,
        null,
        "Giá trị isDisplayed phải là true hoặc false",
        "Dữ liệu không hợp lệ"
      );
    }

    const banner = await Banner.findByIdAndUpdate(
      bannerId,
      { isDisplayed },
      { new: true }
    );

    if (!banner) {
      return sendResponse(
        res,
        404,
        false,
        null,
        "Không tìm thấy banner",
        "Banner không tồn tại"
      );
    }

    return sendResponse(
      res,
      200,
      true,
      banner,
      null,
      `Cập nhật trạng thái hiển thị thành công: ${isDisplayed ? "Hiển thị" : "Ẩn"}`
    );
  } catch (error) {
    next(error);
  }
};

module.exports = displayBanner;