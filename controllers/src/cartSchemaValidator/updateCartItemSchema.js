const Joi = require("joi");

const updateCartItemSchema = Joi.object({
  productId: Joi.string().trim().required().messages({
    "any.required": "Product ID is required",
    "string.base": "Product ID must be a string",
    "string.empty": "Product ID cannot be empty",
  }),

  quantity: Joi.number().integer().min(0).required().messages({
    "any.required": "Quantity is required",
    "number.base": "Quantity must be a number",
    "number.min": "Quantity cannot be negative",
  }),
});

module.exports = updateCartItemSchema;