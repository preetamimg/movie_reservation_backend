const Joi = require("joi");

exports.userSchema = Joi.object({
  email: Joi.string().required(),
  password: Joi.string().required(),
});