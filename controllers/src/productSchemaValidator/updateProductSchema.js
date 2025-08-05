// File: updateProductSchema.js
const Joi = require("joi");

const updateProductSchema = Joi.object({
  title: Joi.string().min(3).max(100).optional(),
  price: Joi.number().positive().optional(),
  description: Joi.string().optional(),
  categoryID: Joi.string().optional(),
  sellerID: Joi.string().optional(),
  URL: Joi.string().uri().optional(),
  quality: Joi.string().valid("Low", "Medium", "High").optional(),
  variants: Joi.array().items(
    Joi.object({
      name: Joi.string().required(),
      price: Joi.number().positive().required(),
      attributes: Joi.object().pattern(Joi.string(), Joi.any()).optional()
    })
  ).optional()
}).min(1); // Phải có ít nhất một trường

module.exports = updateProductSchema;