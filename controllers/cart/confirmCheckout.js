const Cart = require("../../models/Cart");
const Product = require("../../models/Product");
const Order = require("../../models/Order");
const { sendResponse } = require("../../helpers/utils");

const confirmCheckout = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return sendResponse(res, 400, false, null, null, "Giỏ hàng trống, không thể xác nhận");
    }

    let totalAmount = 0;
    const confirmedItems = cart.items.map((item) => {
      const product = item.productId;
      const quantity = item.quantity;
      const price = product.selectedVariant?.price || product.price;
      const subTotal = price * quantity;
      totalAmount += subTotal;

      return {
        productId: product._id,
        name: product.name,
        imageURL: product.imageURL,
        price,
        quantity,
        subTotal,
        variant: product.selectedVariant || null,
      };
    });

    const shippingFee = 30000; // cố định
    const discount = 0; // xử lý sau nếu có mã
    const totalPayable = totalAmount + shippingFee - discount;

    const confirmation = {
      items: confirmedItems,
      totalAmount,
      shippingFee,
      discount,
      totalPayable,
    };

    return sendResponse(res, 200, true, confirmation, null, "Xác nhận đơn hàng thành công");
  } catch (error) {
    next(error);
  }
};

const checkout = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");

    if (!cart || cart.items.length === 0) {
      return sendResponse(res, 400, false, null, null, "Giỏ hàng trống, không thể thanh toán");
    }

    const orderItems = cart.items.map((item) => {
      const product = item.productId;
      const quantity = item.quantity;
      const price = product.selectedVariant?.price || product.price;

      return {
        productId: product._id,
        name: product.name,
        price,
        quantity,
        variant: product.selectedVariant || null,
        subTotal: price * quantity,
      };
    });

    const totalAmount = orderItems.reduce((sum, item) => sum + item.subTotal, 0);

    const newOrder = await Order.create({
      userId: req.user._id,
      items: orderItems,
      totalAmount,
      status: "Đang xử lý",
      createdAt: new Date(),
    });

    await Cart.deleteOne({ userId: req.user._id });

    return sendResponse(res, 200, true, {
      orderId: newOrder._id,
      totalAmount,
    }, null, "Đặt hàng thành công");
  } catch (error) {
    next(error);
  }
};

module.exports = {
  confirmCheckout,
  checkout,
};