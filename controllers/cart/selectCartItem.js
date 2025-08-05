// PATCH /api/cart/select/:itemId
const CartItem = require("../../models/CartItem");
const { sendResponse } = require("../../helpers/utils");

const selectItem = async (req, res, next) => {
  try {
    const { itemId } = req.params;
    const { isSelected } = req.body;

    console.log("🔧 selectItem called");
    console.log("👉 itemId:", itemId);
    console.log("👉 isSelected:", isSelected);

    const userId = req.user?._id;
    if (!userId) {
      return sendResponse(res, 401, false, null, "Người dùng chưa được xác thực", "Lỗi");
    }

    if (typeof isSelected !== "boolean") {
      return sendResponse(res, 400, false, null, "Giá trị isSelected không hợp lệ", "Lỗi");
    }

    const item = await CartItem.findOneAndUpdate(
      { _id: itemId, userId },
      { isSelected },
      { new: true }
    );

    if (!item) {
      return sendResponse(res, 404, false, null, "Không tìm thấy sản phẩm trong giỏ hàng", "Lỗi");
    }

    return sendResponse(res, 200, true, item, null, "Cập nhật trạng thái chọn sản phẩm thành công");
  } catch (error) {
    console.error("❌ Lỗi khi cập nhật trạng thái chọn sản phẩm:", error);
    next(error);
  }
};

module.exports = selectItem;