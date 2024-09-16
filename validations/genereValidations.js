const Joi = require("joi");

exports.genereSchema = Joi.object({
  title: Joi.string().required(),
});