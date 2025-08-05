// controllers/cart/updateCartItem.js
const Cart = require("../../models/Cart");
const { AppError, sendResponse } = require("../../helpers/utils");

const updateCartItem = async (req, res, next) => {
  try {
    const { productId, quantity } = req.body;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      throw new AppError(404, "Cart not found for user.");
    }
    const itemIndex = cart.items.findIndex(
      (item) => item.productId.toString() === productId
    );
    if (itemIndex === -1) {
      throw new AppError(404, "Product not found in cart.");
    }
    // Nếu số lượng <= 0 thì xóa sản phẩm khỏi giỏ
    if (quantity <= 0) {
      cart.items.splice(itemIndex, 1);
    } else {
      cart.items[itemIndex].quantity = quantity;
    }
    await cart.save();
    return sendResponse(res, 200, true, cart, null, "Cart updated successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = updateCartItem;