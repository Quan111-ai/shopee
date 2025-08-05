const Cart = require("../../models/Cart");
const Deal = require("../../models/Deal");
const { AppError, sendResponse } = require("../../helpers/utils");

const checkoutCart = async (req, res, next) => {
  try {
    const { discountCode, selectedProductIds = [] } = req.body;

    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      throw new AppError(404, "Giỏ hàng trống");
    }

    // ✅ Convert mảng productId từ FE sang kiểu đồng nhất để so sánh
    const selectedIdsSet = new Set(selectedProductIds.map(String));

    const filteredItems = cart.items.filter((item) =>
      item.productId && selectedIdsSet.has(String(item.productId._id))
    );

    if (filteredItems.length === 0) {
      throw new AppError(400, "Không có sản phẩm nào được chọn để thanh toán");
    }

    // ✅ Tính toán đơn hàng từ filteredItems
    let totalPrice = 0;
    const computedItems = filteredItems.map((item) => {
      const product = item.productId;
      const quantity = item.quantity;
      const price = product?.selectedVariant?.price || product?.price || 0;
      const subTotal = price * quantity;
      totalPrice += subTotal;

      return {
        productId: product._id,
        name: product.name,
        price,
        quantity,
        subTotal,
        variant: product.selectedVariant || null,
      };
    });

    // ✅ Áp mã giảm giá nếu có
    let discountPercentage = 0;
    if (discountCode) {
      const deal = await Deal.findOne({ code: discountCode, status: "active" });
      if (deal?.discountPercentage) {
        discountPercentage = deal.discountPercentage;
      }
    }

    const discountAmount = totalPrice * (discountPercentage / 100);
    const finalPrice = totalPrice - discountAmount;

    return sendResponse(
      res,
      200,
      true,
      {
        items: computedItems,
        discountCode: discountCode || null,
        discountPercentage,
        discountAmount,
        totalPrice,
        finalPrice,
      },
      null,
      "Tính tiền giỏ hàng thành công"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = checkoutCart;