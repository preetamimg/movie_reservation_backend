const MovieModel = require("../models/movieModel")

exports.getMovie = async (key, value)=> {
  try {
    const movie = await MovieModel.findOne({[key] : value})
    return movie
  } catch (error) {
    
  }
}

exports.updateMovieReleaseStatus = async ()=> {
  try {
    const data = await MovieModel.updateMany(
      {releaseDate : {$lte : new Date()}, movieReleaseStatus : 'upcoming'},
      {$set : {movieReleaseStatus : 'released'}}
    )
  } catch (error) {
    console.log('error')
  }
}