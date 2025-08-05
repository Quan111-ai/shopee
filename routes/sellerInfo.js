const express = require("express");
const router = express.Router();

const getSeller = require("../controllers/SellerManager/getSeller");
const setShopLevel = require("../controllers/roleManager/setShopLevel");

const { authenticate } = require("../middlewares/auth");

// (Optional) Nếu có middleware phân quyền:
const isAdminOrStaff = (req, res, next) => {
  if (["admin", "staff"].includes(req.user.role)) return next();
  return res.status(403).json({ success: false, message: "Access denied. Only admin or staff can perform this action." });
};

// 📌 Lấy thông tin seller theo ID
router.get("/:SellerID", getSeller);

// 📌 Gán cấp độ cho seller theo ID (chỉ staff hoặc admin được phép)
router.put("/:SellerID/level", authenticate, isAdminOrStaff, setShopLevel);

module.exports = router;