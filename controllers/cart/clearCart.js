// controllers/cart/clearCart.js
const Cart = require("../../models/Cart");
const { sendResponse } = require("../../helpers/utils");

const clearCart = async (req, res, next) => {
  try {
    let cart = await Cart.findOneAndUpdate(
      { userId: req.user._id },
      { items: [] },
      { new: true }
    );
    return sendResponse(res, 200, true, cart, null, "Cart cleared successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = clearCart;