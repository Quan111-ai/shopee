// File: getProductByIdSchema.js
const Joi = require("joi");

const getProductByIdSchema = Joi.object({
  id: Joi.string().required()
});

module.exports = getProductByIdSchema;