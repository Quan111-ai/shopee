const Joi = require("joi");

const createProductSchema = Joi.object({
  // ✅ Tên sản phẩm: bắt buộc, từ 3 đến 100 ký tự
  title: Joi.string().min(3).max(100).required(),

  // ✅ Mô tả sản phẩm: có thể để trống
  Description: Joi.string().allow("", null),

  // ✅ Giá sản phẩm: bắt buộc, phải là số dương
  Price: Joi.number().positive().required(),

  // ✅ SellerID: bắt buộc, phải có định dạng ObjectId (24 ký tự hex)
  SellerID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).required(),

  // ✅ categoryID: nếu client gửi categoryID thì sẽ hợp lệ
  categoryID: Joi.string().regex(/^[0-9a-fA-F]{24}$/).optional().allow(null, ""),

  

  // ✅ Quality: bắt buộc, chỉ nhận một trong các giá trị "Low", "Medium", "High"
  Quality: Joi.string().valid("Low", "Medium", "High").required(),

  // ✅ variants: có thể là một mảng hoặc JSON string parse thành mảng
  variants: Joi.alternatives().try(
    Joi.array().items(
      Joi.object({
        name: Joi.string().required(),
        price: Joi.number().positive().required(),
        attributes: Joi.object().pattern(Joi.string(), Joi.any()).optional()
      })
    ),
    Joi.string().custom((value, helpers) => {
      try {
        const parsed = JSON.parse(value);
        if (!Array.isArray(parsed)) {
          throw new Error("Parsed value is not an array");
        }
        return parsed;
      } catch (err) {
        return helpers.error("any.invalid", {
          message: "variants must be a valid JSON array"
        });
      }
    }, "JSON string to array conversion")
  ).optional()
});

module.exports = createProductSchema;