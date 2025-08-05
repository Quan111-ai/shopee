// models/Cart.js
const mongoose = require("mongoose");

const CartItemSchema = new mongoose.Schema(
  {
    productId: { 
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true 
    },
    quantity: { 
      type: Number,  
      default: 1  
    },
    productData: {
      name: { type: String },
      description: { type: String },
      price: { type: Number },
      sellerID: { type: mongoose.Schema.Types.ObjectId, ref: "Seller" },
      category: { 
        _id: { type: mongoose.Schema.Types.ObjectId },
        name: { type: String }
      },
      imageURL: { type: String },
      quality: { type: String },
      variants: { type: Array },
      activeDeals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deal" }],
      appliedDealCode: { type: String, default: null },
      selectedVariant: { type: mongoose.Schema.Types.Mixed } // Lưu variant đã chọn
    }
  },
  { _id: false }
);

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: [CartItemSchema],
  },
  { timestamps: true }
);

const Cart = mongoose.model("Cart", CartSchema);
module.exports = Cart;