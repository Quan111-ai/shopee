const jwt = require("jsonwebtoken");
const { AppError } = require("d:/webb/backsau/helpers/utils");
const mongoose = require("mongoose");
const {  Seller } = require("d:/webb/backsau/models/Seller");
const { User } = require("d:/webb/backsau/models/User");
// ✅ Định nghĩa model User & Seller chỉ khi cần, sau khi kết nối sẵn sàng
let getModelByRole = (role) => {
  if (role === "seller") {
    return mongoose.models.Seller || mongoose.model("Seller", require("../models/SellerSchema"));
  } else {
    return mongoose.models.User || mongoose.model("User", require("../models/UserSchema"));
  }
};

// ✅ Hàm chờ MongoDB kết nối
function waitForMongoConnection(timeout = 5000) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const interval = setInterval(() => {
      if (mongoose.connection.readyState === 1) {
        clearInterval(interval);
        resolve();
      } else if (Date.now() - start > timeout) {
        clearInterval(interval);
        reject(new Error("Timeout waiting for MongoDB connection"));
      }
    }, 100);
  });
}

const authenticate = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error("❌ No token provided.");
      return next(new AppError(401, "Access denied. No token provided."));
    }

    const token = authHeader.replace("Bearer ", "").trim();
    console.log("🔍 Received Token:", token);

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      console.error("❌ Token verification failed:", err);
      return next(new AppError(403, "Invalid or expired token"));
    }

    console.log("🔍 Decoded Token Payload:", decoded);

    const userId = decoded.userId || decoded.iduser || decoded.id || decoded._id;
    if (!userId) {
      console.error("❌ Invalid token structure: Missing user ID");
      return next(new AppError(403, "Invalid token structure: Missing user ID"));
    }

    console.log(`🔍 Extracted user ID: ${userId}`);

    // ✅ Chờ MongoDB sẵn sàng trước khi model được dùng
    if (mongoose.connection.readyState !== 1) {
      try {
        await waitForMongoConnection();
      } catch (e) {
        console.error("❌ MongoDB connection error:", e);
        return next(new AppError(500, "Database connection error"));
      }
    }

    const role = decoded.role || "user";
    const model = getModelByRole(role);

    const timerLabel = `MongoDB Query ${Date.now()}`;
    console.time(timerLabel);
    let user;
    try {
      user = await model.findById(userId).select("-passwordHash").lean();
    } catch (err) {
      console.error("❌ MongoDB Query Error:", err);
      return next(new AppError(500, "Database query failed"));
    }
    console.timeEnd(timerLabel);

    if (!user) {
      console.error("❌ No user found for ID:", userId);
      return next(new AppError(404, "User not found"));
    }

    console.log("✅ User authenticated successfully:", user);
    req.user = user;
    next();
  } catch (error) {
    console.error("❌ JWT Authentication Error:", error);
    return next(new AppError(403, "Invalid or expired token"));
  }
};

module.exports = { authenticate };