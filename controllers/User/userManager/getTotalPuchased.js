const jwt = require("jsonwebtoken");
const User = require("../../../models/User");

const getTotalPurchased = async (req, res) => {
  try {
    // ✅ Kiểm tra token hợp lệ
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Unauthorized - No token provided" });
    }
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("totalPurchased rank");
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      userId: user._id,
      totalPurchased: user.totalPurchased,
      rank: user.rank,
    });
  } catch (error) {
    console.error("Error getting totalPurchased:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { getTotalPurchased };
