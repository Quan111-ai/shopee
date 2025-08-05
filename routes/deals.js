// routes/deals.js
const express = require("express");
const router = express.Router();

// Middleware xác thực - đảm bảo các route cần bảo vệ chỉ truy cập bởi người dùng đã được xác thực.
const { authenticate } = require("../controllers/middleware/authenticate");

// Import các action từ controller Deal
const {
  createDeal,
  getDealById,
  getDealsList,
  updateDeal,
  deleteDeal,
  applyDeal,
  assignDealToUser,
  
} = require("../controllers/deal");

// Import controller activateDeal (mới)
const activateDeal = require("../controllers/deal/activateDeal");

// Route tạo Deal (chỉ cho seller/admin/staff tạo)
router.post("/", authenticate, createDeal);
// Route lấy danh sách tất cả các Deal (công khai)
router.get("/", getDealsList);
// Route lấy chi tiết Deal theo ID
router.get("/:id", getDealById);
// Route cập nhật Deal (chỉ cho seller/admin/staff, xác thực cần thiết)
router.put("/:id", authenticate, updateDeal);
// Route xóa Deal (chỉ cho seller/admin/staff)
router.delete("/:id", authenticate, deleteDeal);
// Route áp dụng Deal do user tự chọn
router.post("/:id/apply", authenticate, applyDeal);
// Route gán Deal trực tiếp cho người dùng (seller/admin/staff)
router.post("/:id/assign", authenticate, assignDealToUser);

// New: Route kích hoạt Deal (activate deal)
router.post("/:id/activate", authenticate, activateDeal);

module.exports = router;