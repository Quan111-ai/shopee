// File: controllers/profile/getUserProfile.js
const jwt = require("jsonwebtoken");
const { AppError, sendResponse } = require("d:/webb/backsau/helpers/utils");

// Import model User và Seller
const User = require("../../../models/User");
const Seller = require("../../../models/Seller");

const getUserProfile = async (req, res, next) => {
  try {
    // Kiểm tra token trong header
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Unauthorized - No token provided");
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Chọn model dựa trên role trong token
    let model;
    if (decoded.role && decoded.role === "seller") {
      model = Seller;
    } else {
      model = User;
    }

    // Lấy người dùng theo userId từ token (token cần chứa userId)
    const user = await model.findById(decoded.userId).select("-passwordHash");
    if (!user) {
      throw new AppError(400, "User not found");
    }

    // ✅ Thêm avatar vào response
    sendResponse(
      res,
      200,
      true,
      { ...user.toObject(), avatar: user.avatar || null },
      null,
      "User profile retrieved successfully"
    );
  } catch (error) {
    next(error);
  }
};

module.exports = getUserProfile;