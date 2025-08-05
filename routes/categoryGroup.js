const express = require("express");
const router = express.Router();

// Import middleware xác thực & phân quyền
const { authenticate } = require("../controllers/middleware/authenticate");
const { AppError } = require("../helpers/utils");

// Tạo middleware riêng để check quyền admin hoặc staff
const isAdminOrStaff = (req, res, next) => {
  if (!req.user || !["admin", "staff"].includes(req.user.role)) {
    return next(new AppError(403, "Access denied: Admin or staff only."));
  }
  next();
};

// Import controller CRUD ngành hàng
const {
  createCategoryGroup,
  getCategoryGroups,
  getCategoryGroupById,
  updateCategoryGroup,
  deleteCategoryGroup,
  getProductsByCategoryGroup,
} = require("../controllers/categoryGroup");

// Import controller upload thumbnail
const uploadThumbnail = require("../controllers/categoryGroup/uploadThumbnail");

// Tạo ngành hàng mới
router.post("/", authenticate, isAdminOrStaff, createCategoryGroup);

// Lấy tất cả ngành hàng
router.get("/", getCategoryGroups);

// Lấy ngành hàng theo ID
router.get("/:id", getCategoryGroupById);

// Lấy sản phẩm theo ngành hàng
router.get("/:id/products", getProductsByCategoryGroup);

// Upload thumbnail cho ngành hàng (dùng Cloudinary)
router.put("/thumbnail/:id", authenticate, isAdminOrStaff, uploadThumbnail);

// Cập nhật ngành hàng
router.put("/:id", authenticate, isAdminOrStaff, updateCategoryGroup);

// Xóa ngành hàng
router.delete("/:id", authenticate, isAdminOrStaff, deleteCategoryGroup);

module.exports = router;