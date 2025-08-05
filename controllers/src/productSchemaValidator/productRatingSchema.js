// File: productRatingSchema.js
const Joi = require("joi");

const reviewSchema = Joi.object({
  userId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional(),
  createdAt: Joi.date().default(() => new Date(), "current date")
});

const productRatingSchema = Joi.object({
  average: Joi.number().min(0).max(5).optional(),
  reviews: Joi.array().items(reviewSchema).optional()
});

module.exports = productRatingSchema;