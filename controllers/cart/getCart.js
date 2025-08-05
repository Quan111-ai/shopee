// controllers/cart/getCart.js
const Cart = require("../../models/Cart");
const { sendResponse } = require("../../helpers/utils");

const getCart = async (req, res, next) => {
  try {
    const cart = await Cart.findOne({ userId: req.user._id }).populate("items.productId");
    return sendResponse(res, 200, true, cart, null, "Cart retrieved successfully.");
  } catch (error) {
    next(error);
  }
};

module.exports = getCart;