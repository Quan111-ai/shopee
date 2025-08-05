// controllers/cart/removeCartItem.js
const Cart = require("../../models/Cart");
const { AppError, sendResponse } = require("../../helpers/utils");

const removeCartItem = async (req, res, next) => {
  try {
    const { productId } = req.params;
    let cart = await Cart.findOne({ userId: req.user._id });
    if (!cart) {
      throw new AppError(404, "Cart not found for user.");
    }
    cart.items = cart.items.filter(
      (item) => item.productId.toString() !== productId
    );
    await cart.save();
    return sendResponse(res, 200, true, cart, null, "Product removed from cart successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = removeCartItem;