const { default: mongoose } = require("mongoose");
const MovieModel = require("../models/movieModel")
const { getMovie, updateMovieReleaseStatus } = require("../services/movieService")
const { checkAdmin } = require("../services/userService");
const { removeImage } = require("../utils/removeImage");
const { responseError, responseSuccess, responseInternalServerError } = require("../utils/responseHandlers")
const dotenv = require('dotenv'); 
const fs = require('fs');
const path = require("path");
dotenv.config();

exports.addMovie = async (req, res)=> {
  const {title, description, trailerUrl, duration, releaseDate, generes, language, rating} = req?.body
  try {
    const check_is_admin = await checkAdmin(req)

    if(check_is_admin) {
      const isMovieAlreadyExist = await getMovie('title', title)
      if(isMovieAlreadyExist) {
        await removeImage('posterImage', req)
        responseError(res, "movie already exists", 400)
      } else {
        const image = req?.files["posterImage"]?.[0]?.filename ? req?.files["posterImage"]?.[0]?.filename : '';
        const movie = new MovieModel({
          posterImage: process.env.IMG_URL + image,
          title, 
          description, 
          trailerUrl, 
          duration, 
          releaseDate : new Date(releaseDate), 
          generes, 
          language, 
          rating
        })
        const data = await movie.save()
        responseSuccess(res, "movie added successfully", data)
      }
    } else {
      responseError(res, "you don't have access to add new movie", 404)
    }
    
  } catch (error) {
    console.log('error', error)
    responseInternalServerError(res)
  }
}


exports.getMovies = async (req, res)=> {
  const page = parseInt(req.query.page) || 1;
  const pageSize = parseInt(req.query.pageSize) || 5;
  const startIndex = (page - 1) * pageSize;
  const genereId = req.query.genereId

  try {

    await updateMovieReleaseStatus()

    const pipeline = [
      {
        '$match': {
          'isDeleted': false
        }
      }
    ]

    if(genereId) {
      pipeline.push(
        {
          '$match': {
            'generes': new mongoose.Types.ObjectId(genereId)
          }
      }
      )
    }

    pipeline.push(
        {
          '$facet': {
            'pagination': [
              {
                '$count': 'totalItems'
              }, {
                '$set': {
                  'totalPages': {
                    '$ceil': {
                      '$divide': [
                        '$totalItems', pageSize 
                      ]
                    }
                  }, 
                  'page': page, 
                  'pageSize': pageSize
                }
              }
            ], 
            'data': [
              {
                '$lookup': {
                  'from': 'geners', 
                  'localField': 'generes', 
                  'foreignField': '_id', 
                  'as': 'generes'
                }
              }, {
                '$set': {
                  'generes': {
                    '$map': {
                      'input': '$generes', 
                      'as': 'genere', 
                      'in': '$$genere.title'
                    }
                  }
                }
              }, {
                '$sort': {
                  'createdAt': 1
                }
              }, {
                '$skip': startIndex
              }, {
                '$limit': pageSize
              }
            ]
          }
        }
      )

    const data = await MovieModel.aggregate(pipeline)
  
    responseSuccess(res, "movie list", data?.[0])
  } catch (error) {
    console.log('error', error)
      responseInternalServerError(res)
  }
}

exports.getSingleMovie = async (req, res) => {
  const movieId = req.query.movieId
  try {
    const pipeline = [
      {
        '$match': {
          'isDeleted': false
        }
      },
      {
        '$match': {
          '_id': new mongoose.Types.ObjectId(movieId)
        }
      }, {
        '$lookup': {
          'from': 'geners', 
          'localField': 'generes', 
          'foreignField': '_id', 
          'as': 'generes'
        }
      }, {
        '$set': {
          'generes': {
            '$map': {
              'input': '$generes', 
              'as': 'genere', 
              'in': '$$genere.title'
            }
          }
        }
      }
    ]
    const data = await MovieModel.aggregate(pipeline)
    if(data) {
      responseSuccess(res, "movie details found", data)
    } else {
      responseError(res, 'Movie not found', 400)
    }
    console.log(data)
  } catch (error) {
    console.log(error)
    responseInternalServerError(res)

  }
}

exports.deleteMovie = async (req, res)=> {
  const movieId = req.query.movieId
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
        const data = await MovieModel.findOneAndDelete({isDeleted: false, _id: movieId})
        if(data) {
          if(data?.posterImage) {
            const imageUrl = data?.posterImage?.split(process.env.IMG_URL)
            const moviePic = path.join(process.cwd(), `public/${imageUrl[1]}`);
            fs.unlink(moviePic, (err)=> {
              if (err) console.log('error', err)
                console.log('image removed sucessfully')
            })
          }
          responseSuccess(res, 'Movie deleted successfully')
        } else {
          responseError(res, 'Movie not available', 400)
        }
    } else {
      responseError(res, "you don't have access to delete this movie", 404)
    }
  } catch (error) {
    responseInternalServerError(res)
    console.log('eeeeeeeeeeeeeeeeeeeee', error)
  }
}

exports.editMovie = async (req, res)=> {
  const movieId = req.query.movieId
  const {_id, ...updatedData} = req?.body
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const isMovieExist = await getMovie('_id', movieId)
      if(!isMovieExist) {
        await removeImage('posterImage', req)
        responseError(res, "movie doesn't exists", 400)
      } else {
      const isMovieTitleExist = await getMovie('title', updatedData?.title)
        if(isMovieTitleExist) {
        responseError(res, "movie title already exists", 400)
        } else {
          const image = req?.files["posterImage"]?.[0]?.filename ? req?.files["posterImage"]?.[0]?.filename : '';
          const movie = {
            posterImage: image ? process.env.IMG_URL + image : updatedData?.posterImage,
            title : updatedData?.title, 
            description : updatedData?.description, 
            trailerUrl : updatedData?.trailerUrl, 
            duration : updatedData?.duration, 
            releaseDate : new Date(updatedData?.releaseDate), 
            generes : updatedData?.generes, 
            language : updatedData?.language, 
            rating : updatedData?.rating
          }
          const data = await MovieModel.findOneAndUpdate({_id: movieId}, movie, {new: true})
          responseSuccess(res, "movie edited successfully", data)
        }
      }
    } else {
      responseError(res, "you don't have access to add new movie", 404)
    }
    
  } catch (error) {
    console.log('error', error)
    responseInternalServerError(res)
  }
}