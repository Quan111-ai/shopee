/**
 * Middleware validate dữ liệu dựa trên schema đã định nghĩa (ví dụ: với Joi).
 * @param {Object} schema - Schema validator (Ví dụ: một đối tượng Joi schema).
 * @param {string} [property='body'] - Vị trí dữ liệu trong request cần validate: body, query, hoặc params.
 */
const validationMiddleware = (schema, property = 'body') => {
  return (req, res, next) => {
    // Validate dữ liệu dựa trên property cung cấp (mặc định là req.body)
    const { error, value } = schema.validate(req[property], { abortEarly: false });

    if (error) {
      // Tổng hợp thông báo lỗi
      const errorMessage = error.details.map(detail => detail.message).join(', ');

      // ✅ Log lỗi để debug
      console.log("❌ Validation error:", errorMessage);

      // Gửi phản hồi lỗi
      return res.status(400).json({
        success: false,
        message: errorMessage
      });
    }

    // ✅ Gắn dữ liệu đã được Joi xử lý vào req
    req[property] = value;

    // Chuyển quyền xử lý sang middleware/controller tiếp theo
    next();
  };
};

module.exports = validationMiddleware;