const { AppError, sendResponse } = require("../../../helpers/utils");
const User = require("../../../models/User");
const Seller = require("../../../models/Seller");
const Staff = require("../../../models/Staff");

const assignRole = async (req, res, next) => {
  try {
    console.log("🔍 Token payload:", req.user); // Debug

    const { userId, newRole, sellerDetails } = req.body;

    // Kiểm tra nếu người cấp quyền có phải admin không
    if (!req.user || req.user.role !== "admin") {
      console.error("❌ Access Denied: User is not admin.");
      throw new AppError(403, "Only admins can assign roles.");
    }

    // Kiểm tra nếu thiếu trường userId hoặc newRole
    if (!userId || !newRole) {
      throw new AppError(400, "userId and newRole are required.");
    }

    // Admin chỉ được phép chuyển đổi thành seller hoặc staff
    const allowedRoles = ["seller", "staff"];
    if (!allowedRoles.includes(newRole)) {
      throw new AppError(400, "Invalid role provided. Admin can only assign seller or staff roles.");
    }

    // Tìm User trong collection User
    const user = await User.findById(userId);
    if (!user) {
      throw new AppError(404, "User not found.");
    }

    // Nếu user đã có role bằng newRole, không cần cập nhật
    if (user.role === newRole) {
      return sendResponse(res, 200, true, user, null, "User already has the assigned role.");
    }

    // ✅ Xử lý chuyển đổi role
    let newUserData;
    if (newRole === "seller") {
      // Yêu cầu sellerDetails phải có tối thiểu trường name
      if (!sellerDetails || !sellerDetails.name) {
        throw new AppError(400, "Seller details are required, including at least a name.");
      }

      newUserData = new Seller({
        userId: user._id,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        phoneNumber: user.phoneNumber,
        address: user.address,
        rank: user.rank,
        role: "seller",
        name: sellerDetails.name,
        storeName: sellerDetails.storeName || sellerDetails.name,
        storeDescription: sellerDetails.storeDescription || "",
      });

      user.role = "seller";
      user.sellerProfile = {
        storeName: sellerDetails.storeName || sellerDetails.name,
        storeDescription: sellerDetails.storeDescription || "",
      };
    } else if (newRole === "staff") {
      newUserData = new Staff({
        userId: user._id,
        username: user.username,
        email: user.email,
        passwordHash: user.passwordHash,
        phoneNumber: user.phoneNumber,
        address: user.address,
        rank: user.rank,
        role: "staff",
      });

      user.role = "staff";
      user.sellerProfile = null;
    }

    await newUserData.save();
    await user.save();

    return sendResponse(res, 200, true, { user, newUserData }, null, `User role updated to ${newRole} successfully.`);
  } catch (error) {
    console.error("🔥 assignRole Error:", error);
    next(error);
  }
};

module.exports = assignRole;