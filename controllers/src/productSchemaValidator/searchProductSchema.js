const Joi = require("joi");

const searchProductSchema = Joi.object({
  keyword: Joi.string().trim().min(1).optional(),
  name: Joi.string().trim().min(1).optional(),
  title: Joi.string().trim().min(1).optional(),
  categoryID: Joi.string().optional(),
  minPrice: Joi.number().min(0).optional(),
  maxPrice: Joi.number().min(0).optional(),
  page: Joi.number().integer().min(1).optional().default(1),
  limit: Joi.number().integer().min(1).max(100).optional().default(20),
  sortBy: Joi.string().valid("price", "title", "createdAt").optional(),
  sortOrder: Joi.string().valid("asc", "desc").optional(),
  Quality: Joi.string().optional(),
  sellerID: Joi.string().optional(),
  status: Joi.string().valid("available", "sold", "hidden").optional(),
  location: Joi.string().optional(),
  specialization: Joi.string().optional(),
});

module.exports = searchProductSchema;