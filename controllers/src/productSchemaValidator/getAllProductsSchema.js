// File: getAllProductsSchema.js
const Joi = require("joi");

const getAllProductsSchema = Joi.object({
  page: Joi.number().integer().min(1).optional(),
  limit: Joi.number().integer().min(1).optional(),
  sort: Joi.string().valid("price", "title", "createdAt").optional(),
  order: Joi.string().valid("asc", "desc").optional()
});

module.exports = getAllProductsSchema;