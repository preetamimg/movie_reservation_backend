const { default: mongoose } = require("mongoose")
const showModel = require("../models/showModel")
const { responseError, responseSuccess } = require("../utils/responseHandlers")
const { getMovie } = require("./movieService")

const break_time_after_every_show_in_minutes = 30

function addMinutesToDate(date, minutes) {
  return new Date(date.getTime() + minutes * 60000 + break_time_after_every_show_in_minutes * 60000);
}

exports.check_show_availability = async (req, res)=> {
  const {timeAndDate, movieId, theaterId, screenId, language, format} = req?.body
  try {
    const getMovieDetails = await getMovie('_id', movieId)
    
    // first we check if show date is not before release date of movie
    const movieReleaseDate = new Date(getMovieDetails?.releaseDate)
    const showDate = new Date(timeAndDate)

    if(movieReleaseDate > showDate) {
      responseError(res, "show can't be created because show date is before movie release date", 400)
      return
    }else {
      // const startOfDay = new Date(showDate.setUTCHours(0, 0, 0, 0));
      // const endOfDay = new Date(showDate.setUTCHours(23, 59, 59, 999));
      
      // const pipeline = [
        //   {
          //     '$match': {
            //       'theaterId': new mongoose.Types.ObjectId('66dee6b068a86fbad235784c'),
            //       'screenId': new mongoose.Types.ObjectId('66dfccee2c21912cb4ef725f'),
            //       'timeAndDate': {
              //         '$gte': startOfDay, 
              //         '$lt': endOfDay
              //       }
              //     }
              //   },
              // ]
              
      // now we will check if the screen is available on that time
      const pipeline = [
        {
          '$match': {
            'theaterId': new mongoose.Types.ObjectId(theaterId), 
            'screenId': new mongoose.Types.ObjectId(screenId)
          }
        }, {
          '$facet': {
            'previousShow': [
              {
                '$match': {
                  'timeAndDate': {
                    '$lte': showDate
                  }
                }
              }, {
                '$sort': {
                  'timeAndDate': -1
                }
              }, 
              {
                '$limit': 1
              },
              {
                '$project': {
                  'timeAndDate': 1, 
                  'movieId': 1
                }
              }
            ], 
            'nextShow': [
              {
                '$match': {
                  'timeAndDate': {
                    '$gte': showDate
                  }
                }
              }, {
                '$sort': {
                  'timeAndDate': 1
                }
              }, {
                '$limit': 1
              },{
                '$project': {
                  'timeAndDate': 1, 
                  'movieId': 1
                }
              }
            ]
          }
        }
      ]
      
      const previous_and_next_shows = await showModel.aggregate(pipeline);

      const has_next_show = ()=> {
        if(previous_and_next_shows?.[0].nextShow?.[0]?.timeAndDate) {
          const next_show_time = previous_and_next_shows?.[0]?.nextShow?.[0]?.timeAndDate;
          const available_end_time = addMinutesToDate(showDate, getMovieDetails?.duration)
          const next_show_end_time = addMinutesToDate(next_show_time, getMovieDetails?.duration)
    
          if(next_show_time > available_end_time) {
            return true
          } else {
            responseError(res, `there is a show already registerd starts on ${next_show_time}. it will end on ${next_show_end_time}. you can add your show after this`, 400)
            return false
          }
        } else {
          return true
        }
      }

        if(previous_and_next_shows?.[0].previousShow?.[0]?.timeAndDate) {
          const getPreviousMovieDetails = await getMovie('_id', previous_and_next_shows?.[0].previousShow?.[0]?.movieId)
  
          const pre_show_time = previous_and_next_shows?.[0]?.previousShow?.[0]?.timeAndDate;
          const pre_movie_duration = getPreviousMovieDetails?.duration
  
          const available_start_time_of_next_show = addMinutesToDate(pre_show_time, pre_movie_duration)
    
          if(available_start_time_of_next_show > new Date(timeAndDate)) {
            responseError(res, `alrady running show in this screen , can add show after ${available_start_time_of_next_show}`, 400)
            return false
          } else {
            return has_next_show()
          }
        } else {
          return has_next_show()
        }
    }

  } catch (error) {
    console.log(error)
  }
}