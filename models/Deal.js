const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const dealSchema = new Schema(
  {
    title: { type: String, required: true },

    dealType: {
      type: String,
      enum: ["percentage", "fixedAmount", "cheapest", "flash"],
      default: "percentage",
    },

    productIDs: {
      type: [Schema.Types.ObjectId],
      ref: "Product",
      required: true,
      validate: {
        validator: (arr) => arr.length > 0,
        message: "At least one product is required for a deal.",
      },
    },

    discountPercentage: {
      type: Number,
      min: 1,
      max: 100,
      required: function () {
        return this.dealType === "percentage";
      },
    },

    fixedAmount: {
      type: Number,
      min: 1,
      required: function () {
        return this.dealType === "fixedAmount";
      },
    },

    quantity: { type: Number, required: true },

    eligibleRanks: {
      type: [String],
      enum: ["Đồng", "Bạc", "Vàng", "Kim Cương"],
      default: ["Đồng", "Bạc", "Vàng", "Kim Cương"],
    },

    startDate: { type: Date, default: null },
    endDate: { type: Date, default: null },
    durationInHours: { type: Number, default: null },

    status: {
      type: String,
      enum: ["pending", "active", "expired"],
      default: "pending",
    },

    activatedAt: { type: Date },
    code: { type: String },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "Seller",
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Deal", dealSchema);