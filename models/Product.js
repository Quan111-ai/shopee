const mongoose = require("mongoose");

const ProductSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },

    SellerID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Seller",
      required: false,
    },

    categoryID: { type: mongoose.Schema.Types.ObjectId, ref: "Category" },

    imageURL: { type: String, required: false, default: "" },
    gallery: { type: [String], default: [] },

    quality: {
      type: String,
      enum: ["Low", "Medium", "High"],
      required: true,
    },

    variants: [
      {
        name: { type: String, required: true },
        price: { type: Number, required: true },
        attributes: { type: mongoose.Schema.Types.Mixed },
      },
    ],

    activeDeals: [{ type: mongoose.Schema.Types.ObjectId, ref: "Deal" }],
    appliedDealCode: { type: String, default: null },

    // ✅ Thêm chức năng đánh giá bằng điểm số:
    rating: {
      average: { type: Number, default: 0 },
      count: { type: Number, default: 0 },
      scores: [
        {
          score: { type: Number, min: 1, max: 5, required: true },
          userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
          comment: { type: String, default: "" },
          ratedAt: { type: Date, default: Date.now },
        },
      ],
    },
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", ProductSchema);
module.exports = Product;