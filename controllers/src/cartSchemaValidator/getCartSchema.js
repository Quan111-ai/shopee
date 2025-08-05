const Joi = require("joi");

const getCartSchema = Joi.object({
  categoryID: Joi.string().optional().trim(),
  shopID: Joi.string().optional().trim(),
});