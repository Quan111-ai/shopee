const Joi = require("joi");

const addToCartSchema = Joi.object({
  productId: Joi.string().trim().required().messages({
    "any.required": "Product ID is required",
    "string.base": "Product ID must be a string",
    "string.empty": "Product ID cannot be empty",
  }),

  quantity: Joi.number().integer().min(1).required().messages({
    "any.required": "Quantity is required",
    "number.base": "Quantity must be a number",
    "number.min": "Quantity must be greater than 0",
  }),

  selectedVariant: Joi.string().trim().optional().messages({
    "string.base": "Variant must be a string",
  }),
});

module.exports = addToCartSchema;