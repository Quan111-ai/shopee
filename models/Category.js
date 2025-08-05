// File: models/Category.js
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategorySchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    // Xác định chủ sở hữu (seller) của Category
    sellerID: { type: mongoose.Schema.Types.ObjectId, ref: "Seller", required: true }
  },
  { timestamps: true }
);

const Category = mongoose.model("Category", CategorySchema);
module.exports = Category;