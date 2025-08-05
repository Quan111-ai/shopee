const jwt = require("jsonwebtoken");
const { AppError, sendResponse } = require("d:/webb/backsau/helpers/utils");
const User = require("d:/webb/backsau/models/User");
const cloudinary = require("d:/webb/backsau/helpers/cloundinary");
const streamifier = require("streamifier");

// ✅ Hàm upload avatar lên Cloudinary
const uploadAvatarToCloudinary = (buffer, userId) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: `avatars/${userId}`, overwrite: true },
      (error, result) => {
        if (result) {
          resolve(result.secure_url);
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(buffer).pipe(uploadStream);
  });
};

const updateUser = async (req, res, next) => {
  try {
    // ✅ Kiểm tra token hợp lệ
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new AppError(401, "Unauthorized - No token provided");
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const updates = req.body;
    const allowedUpdates = [
      "username", "email", "phoneNumber", "address", "rank", "role",
      "cart", "purchaseHistory", "avatar" // ✅ Cho phép cập nhật avatar
    ];

    const isValidUpdate = Object.keys(updates).every(field =>
      allowedUpdates.includes(field)
    );

    if (!isValidUpdate) {
      throw new AppError(400, "Invalid update fields");
    }

    // ✅ Kiểm tra nếu có file avatar upload
    if (req.files?.avatar?.length > 0) {
      updates.avatar = await uploadAvatarToCloudinary(req.files.avatar[0].buffer, decoded.userId);
    }

    const user = await User.findByIdAndUpdate(decoded.userId, updates, {
      new: true,
      runValidators: true,
    }).select("username email phoneNumber address rank role cart purchaseHistory avatar");

    if (!user) {
      throw new AppError(400, "User not found");
    }

    sendResponse(res, 200, true, user, null, "Profile updated successfully");
  } catch (error) {
    next(error);
  }
};

module.exports = updateUser;