const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const passport = require("passport");
const { sendResponse, AppError } = require("../helpers/utils");
const router = express.Router();

// Import các model của các role
const Admin = require("../models/Admin");
const Seller = require("../models/Seller");
const Staff = require("../models/Staff");
const User = require("../models/User");

// ✅ API đăng nhập
router.post("/", async (req, res, next) => {
  try {
    console.log("📩 Incoming Login Request:", req.body);

    if (!process.env.JWT_SECRET) {
      console.error("❌ Missing JWT_SECRET!");
      throw new AppError(500, "Server misconfiguration: JWT_SECRET is missing");
    }

    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB is not connected!");
      throw new AppError(500, "Database connection error");
    }

    const { email, password } = req.body;
    if (!email || !password) {
      throw new AppError(400, "Email and password are required");
    }

    let foundUser = await Admin.findOne({ email }).select("+passwordHash")
      || await Seller.findOne({ email }).select("+passwordHash")
      || await Staff.findOne({ email }).select("+passwordHash")
      || await User.findOne({ email }).select("+passwordHash");

    if (!foundUser) {
      console.error("❌ Invalid email or password:", email);
      throw new AppError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, foundUser.passwordHash);
    if (!isMatch) {
      console.error("❌ Password mismatch for:", email);
      throw new AppError(401, "Invalid email or password");
    }

    const token = jwt.sign(
      { id: foundUser._id, role: foundUser.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    console.log("✅ User role on login:", foundUser.role);

    console.log("✅ Login Successful:", foundUser.email);

    const resultUser = {
      id: foundUser._id,
      username: foundUser.username,
      email: foundUser.email,
      role: foundUser.role,
      SellerID: foundUser.role === "seller" ? foundUser._id : undefined,
      StaffID: foundUser.role === "staff" ? foundUser._id : undefined,
    };

    sendResponse(res, 200, true, { token, user: resultUser }, null, "Login successful");
  } catch (error) {
    console.error("🔥 Login Error:", error);
    next(error);
  }
});

// ✅ Đăng nhập bằng Google
router.get("/google", passport.authenticate("google", { scope: ["profile", "email"] }));
router.get("/google/callback", passport.authenticate("google", { failureRedirect: "/" }), (req, res) => {
  if (!req.user) return res.redirect("/login");
  const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`/dashboard?token=${token}`);
});

// ✅ Đăng nhập bằng Facebook
router.get("/facebook", passport.authenticate("facebook", { scope: ["email"] }));
router.get("/facebook/callback", passport.authenticate("facebook", { failureRedirect: "/" }), (req, res) => {
  if (!req.user) return res.redirect("/login");
  const token = jwt.sign({ id: req.user._id, role: req.user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
  res.redirect(`/dashboard?token=${token}`);
});

// ✅ API kiểm tra trạng thái đăng nhập
router.get("/status", async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    let user = await User.findById(userId) || await Admin.findById(userId)
      || await Seller.findById(userId) || await Staff.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({ success: true, user, message: "Authenticated successfully" });
  } catch (error) {
    console.error("❌ Authentication Error:", error);
    next(new AppError(403, "Invalid or expired token"));
  }
});

module.exports = router;