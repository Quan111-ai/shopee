// models/User.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema(
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


    // Thêm trường để lưu thời điểm rank được cập nhật (gia hạn)
    rankUpdatedAt: { type: Date, default: Date.now },

    role: {
      type: String,
      enum: ["user", "seller", "admin", "staff"],
      default: "user",
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

    // Trường ownedDeals để lưu danh sách các deal mà người dùng đã áp dụng
    ownedDeals: [
      {
        dealId: { type: Schema.Types.ObjectId, ref: "Deal" },
        appliedAt: { type: Date, default: Date.now },
        productID: { type: Schema.Types.ObjectId, ref: "Product" },
      },
    ],
  },
  { timestamps: true }
);
// userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

console.log("✅ User Model Loaded");

const User = mongoose.model("User", userSchema, "users"); // Collection "users"
module.exports = User;