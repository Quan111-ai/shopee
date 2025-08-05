const multer = require("multer");
const path = require("path");

// Sử dụng memoryStorage để lưu file trong bộ nhớ (buffer)
const storage = multer.memoryStorage();

// Bộ lọc file: chỉ cho phép định dạng ảnh hợp lệ
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|gif/;
  const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimeType = allowedTypes.test(file.mimetype);

  if (extName && mimeType) {
    cb(null, true);
  } else {
    cb(new Error("Only images are allowed"), false);
  }
};

// ✅ Xuất middleware đúng cách để không lỗi ở routes
const upload = multer({
  storage: storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // Giới hạn file 5MB
  fileFilter: fileFilter,
}).fields([
  { name: "image", maxCount: 1 }, // ✅ Xác định rõ key `"image"`
  { name: "images", maxCount: 5 }, // ✅ Xác định danh sách ảnh
]);
module.exports = upload;