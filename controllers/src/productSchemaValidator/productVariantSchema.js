// File: productVariantSchema.js
const Joi = require("joi");

const productVariantSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().positive().required(),
  attributes: Joi.object().pattern(Joi.string(), Joi.any()).optional()
});

module.exports = productVariantSchema;