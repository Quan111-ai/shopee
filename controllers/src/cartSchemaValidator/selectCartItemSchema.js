const Joi = require("joi");

// ✅ Gộp params và body thành một schema duy nhất
const selectCartItemSchema = Joi.object({
  productId: Joi.string()
    .regex(/^[0-9a-fA-F]{24}$/)
    .required()
    .messages({
      "string.pattern.base": "productId phải là ObjectId hợp lệ",
      "any.required": "Thiếu productId trong URL"
    }),

  isSelected: Joi.boolean()
    .required()
    .messages({
      "boolean.base": "isSelected phải là kiểu boolean",
      "any.required": "Thiếu isSelected trong body"
    })
});

module.exports = selectCartItemSchema;