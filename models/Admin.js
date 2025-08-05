// models/Admin.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const ProductCatalog = require("./Category");

const adminSchema = new Schema(
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

    role: {
      type: String,
      enum: ["user", "seller", "admin", "staff"],
      default: "admin",
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
  },
  { timestamps: true }
);

console.log("✅ Admin Model Loaded");

const Admin = mongoose.model("Admin", adminSchema, "admins"); // Collection "admins"
module.exports = Admin;