const Joi = require("joi");

const checkoutCartSchema = Joi.object({
  discountCode: Joi.string().trim().min(1).optional().messages({
    "string.base": "Discount code must be a string",
    "string.empty": "Discount code cannot be empty",
    "string.min": "Discount code cannot be blank",
  }),
});

module.exports = checkoutCartSchema;