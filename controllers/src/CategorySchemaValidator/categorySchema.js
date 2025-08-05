const Joi = require("joi");

const categoryValidator = Joi.object({
  name: Joi.string().min(3).max(50).required().messages({
    "string.base": `"name" phải là một chuỗi`,
    "string.empty": `"name" không được để trống`,
    "string.min": `"name" phải có ít nhất 3 ký tự`,
    "string.max": `"name" không được dài quá 50 ký tự`,
    "any.required": `"name" là bắt buộc`
  }),
  
  description: Joi.string().max(500).optional().messages({
    "string.base": `"description" phải là một chuỗi`,
    "string.max": `"description" không được dài quá 500 ký tự`
  }),

  sellerID: Joi.string().hex().length(24).required().messages({
    "string.base": `"sellerID" phải là một chuỗi`,
    "string.hex": `"sellerID" phải là ObjectId hợp lệ`,
    "string.length": `"sellerID" phải có độ dài 24 ký tự`,
    "any.required": `"sellerID" là bắt buộc`
  })
});

module.exports = categoryValidator;