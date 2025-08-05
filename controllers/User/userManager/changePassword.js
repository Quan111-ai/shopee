const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { AppError, sendResponse } = require("d:/webb/backsau/helpers/utils");
const User = require("d:/webb/backsau/models/User");

const changePassword = async (req, res, next) => {
  try {
    // ✅ Kiểm tra token hợp lệ
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Unauthorized - No token provided");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      throw new AppError(400, "Current password and new password are required");
    }

    const user = await User.findById(decoded.userId);
    if (!user) {
      throw new AppError(404, "User not found");
    }

    const isMatch = await bcrypt.compare(currentPassword, user.passwordHash);
    if (!isMatch) {
      throw new AppError(401, "Current password is incorrect");
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await user.save();

    sendResponse(res, 200, { message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = changePassword;
