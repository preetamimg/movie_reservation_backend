const Joi = require("joi");

exports.movieSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  trailerUrl: Joi.string().required(),
  duration: Joi.number().required(),
  releaseDate: Joi.string().required(),
  generes: Joi.array().required(),
  language: Joi.string().required(),
  rating: Joi.number().required(),
  // posterImage: Joi.number().required(),
});