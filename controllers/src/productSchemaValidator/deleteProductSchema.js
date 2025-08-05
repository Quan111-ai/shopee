// File: deleteProductSchema.js
const Joi = require("joi");

const deleteProductSchema = Joi.object({
  id: Joi.string().required()
});

module.exports = deleteProductSchema;