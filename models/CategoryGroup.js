const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const CategoryGroupSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      unique: true,
    },

    description: {
      type: String,
    },

    // Link ảnh thumbnail (nhỏ đại diện cho ngành hàng)
    thumbnail: {
      type: String,
      trim: true,
      default: "",
    },

    categories: [
      {
        type: Schema.Types.ObjectId,
        ref: "Category",
        required: true,
      },
    ],

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("CategoryGroup", CategoryGroupSchema);