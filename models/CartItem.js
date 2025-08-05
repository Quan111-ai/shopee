const mongoose = require("mongoose");

const cartItemSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
  quantity: { type: Number, default: 1 },
  isSelected: { type: Boolean, default: false } // ✅ tick chọn để thanh toán
}, {
  timestamps: true
});

module.exports = mongoose.model("CartItem", cartItemSchema);