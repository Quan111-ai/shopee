const Joi = require("joi");

const removeCartItemSchema = Joi.object({
  productId: Joi.string().trim().required().messages({
    "any.required": "Product ID is required",
    "string.base": "Product ID must be a string",
    "string.empty": "Product ID cannot be empty",
  }),
});

module.exports = removeCartItemSchema;