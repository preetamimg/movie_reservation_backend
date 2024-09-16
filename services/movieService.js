const MovieModel = require("../models/movieModel")

exports.getMovie = async (key, value)=> {
  try {
    const movie = await MovieModel.findOne({[key] : value})
    return movie
  } catch (error) {
    
  }
}