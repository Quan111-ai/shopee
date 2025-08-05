// models/Seller.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const sellerSchema = new Schema(
  {
    username: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    passwordHash: { type: String, required: true },
    phoneNumber: { type: String, required: true },

    address: {
      street: { type: String, required: true },
      city: { type: String, required: true },
      country: { type: String, required: true },
      postalCode: { type: String, required: true },
    },

    rank: {
      type: String,
      enum: ["Đồng", "Bạc", "Vàng", "Kim Cương"],
      default: "Đồng",
    },
    avatar: { type: String, default: null },

    role: {
      type: String,
      enum: ["user", "seller", "admin", "staff"],
      default: "seller",
      required: true,
    },

    premiumExpiryDate: { type: Date },
    sellerRequestStatus: {
      type: String,
      enum: ["none", "pending", "approved", "rejected"],
      default: "none",
    },
    cart: [
      {
        productId: { type: Schema.Types.ObjectId, ref: "ProductCatalog" },
        quantity: { type: Number, required: true, min: 1 },
      },
    ],
    purchaseHistory: [
      {
        orderId: { type: Schema.Types.ObjectId, ref: "Order" },
        purchaseDate: { type: Date, default: Date.now },
        totalAmount: { type: Number, required: true },
      },
    ],

    lastPurchasedAt: { type: Date, default: null },
    remainingDays: { type: Number, default: null },

    products: [{ type: Schema.Types.ObjectId, ref: "Product" }],
    storeName: { type: String, required: true },
    storeDescription: { type: String, default: "" },

    // ✅ Thêm trường mới để phân cấp shop:
    level: {
      type: String,
      enum: ["Shop Mall", "Chính Hãng", "Shop Giá Rẻ", "Shop Thường"],
      default: "Shop Thường",
    },
  },
  { timestamps: true }
);

console.log("✅ Seller Model Loaded with level field");
const Seller = mongoose.model("Seller", sellerSchema, "sellers");
module.exports = Seller;