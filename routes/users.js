var express = require("express");
var router = express.Router();
const assignRole = require("d:/webb/backsau/controllers/User/roleManager/assignRole");


/* Router GET user profile */
router.get("/", (req, res) => res.send("respond with a resource"));
router.post("/", (req, res) => res.send("respond with a resource"));
router.put("/changepassword", (req, res) => res.send("respond with a resource"));




// Phương thức đăng nhập
router.post("/login", (req, res) => res.send("respond with a resource"));
// Phương thức đăng ký
router.post("/register", (req, res) => res.send("respond with a resource"));
// ✅ Route cập nhật vai trò người dùng
router.post("/assign-role", assignRole);

module.exports = router;