const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { sendResponse, AppError } = require("../helpers/utils");
const User = require("../models/User");

const register = async (req, res, next) => {
  try {
    console.log("📩 Incoming Register Request:", req.body);

    // 🛑 Kiểm tra kết nối MongoDB trước khi thực hiện
    if (mongoose.connection.readyState !== 1) {
      console.error("❌ MongoDB is not connected!");
      throw new AppError(500, "Database connection error");
    }

    const { username, email, password, phoneNumber, address } = req.body;

    // 🛑 Kiểm tra thông tin bắt buộc
    if (!username || !email || !password) {
      throw new AppError(400, "Username, email, and password are required");
    }

    // 🔍 Kiểm tra email đã tồn tại chưa
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new AppError(400, "Email is already registered");
    }

    console.log("🔐 Hashing password...");
    const hashedPassword = await bcrypt.hash(password, 10);

    console.log("✅ Creating new user...");

    // ✅ Tạo user mới với giá trị mặc định nếu không được gửi từ client
    const newUser = new User({
      username,
      email,
      passwordHash: hashedPassword,
      phoneNumber: phoneNumber || "N/A", // Nếu không có, gán mặc định
      address: address || { street: "N/A", city: "N/A", country: "N/A", postalCode: "N/A" },
      rank: "Đồng",
      role: "user",
      premiumExpiryDate: null,
      sellerRequestStatus: "none",
      cart: [],
      purchaseHistory: [],
      lastPurchasedAt: null,
      remainingDays: null,
    });

    // 💾 Lưu user vào database
    await newUser.save();
    console.log("✅ User Created Successfully!");

    sendResponse(res, 201, "User registered successfully");
  } catch (error) {
    console.error("🔥 Register Error:", error);
    next(error);
  }
};

module.exports = register;
