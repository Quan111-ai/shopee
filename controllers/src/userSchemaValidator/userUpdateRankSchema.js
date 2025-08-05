const Joi = require("joi");

const UserUpdateRankValidationSchema = Joi.object({
  totalPurchased: Joi.number().integer().min(0).required(),
});

module.exports = UserUpdateRankValidationSchema;
