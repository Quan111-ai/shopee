const express = require("express");
const router = express.Router();
const { authenticate } = require("../controllers/middleware/authenticate");
const upload = require("../controllers/middleware/multer.middleware");
const updateProfile = require("d:/webb/backsau/controllers/User/userManager/updateUser"); // ✅ Gọi controller
const getProfile = require("d:/webb/backsau/controllers/User/userManager/getUserProfile"); // ✅ Gọi controller
// ✅ GET user profile
router.get("/", authenticate, getProfile);

// ✅ PUT user profile (Cập nhật thông tin & avatar)
router.put("/", authenticate, updateProfile);

module.exports = router;