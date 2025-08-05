// File: routes/category.js
const express = require("express");
const router = express.Router();
const {
  createCategory,
  getCategories,
  getCategoryById,
  updateCategory,
  deleteCategory
} = require("../controllers/category");
const { authenticate } = require("../controllers/middleware/authenticate");
// Tạo mới Category
router.post("/",authenticate, createCategory);

// Lấy danh sách Categories
router.get("/",authenticate, getCategories);

// Lấy thông tin chi tiết của Category theo ID
router.get("/:id",authenticate, getCategoryById);

// Cập nhật Category theo ID
router.patch("/:id",authenticate, updateCategory);

// Xóa Category theo ID
router.delete("/:id",authenticate, deleteCategory);

module.exports = router;