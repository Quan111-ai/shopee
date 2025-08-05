const mongoose = require('mongoose');

const bannerSchema = new mongoose.Schema({
  title: { type: String, required: true },
  imageUrl: { type: String, required: true },
  redirectUrl: { type: String },
  isDisplayed: { type: Boolean, default: false } // ✅ banner được chọn để hiển thị
}, {
  timestamps: true
});

module.exports = mongoose.model('Banner', bannerSchema);