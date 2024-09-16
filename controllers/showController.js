const showModel = require("../models/showModel")
const { check_show_availability } = require("../services/showServices")
const { checkAdmin } = require("../services/userService")
const { responseError, responseSuccess, responseInternalServerError } = require("../utils/responseHandlers")


exports.createShow = async (req, res)=> {
  const {timeAndDate, movieId, theaterId, screenId, language, format} = req?.body
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const check_show_availability_status = await check_show_availability(req, res)
      if(check_show_availability_status) {
        const show = new showModel({
          timeAndDate : new Date(timeAndDate), 
          movieId, 
          theaterId, 
          screenId, 
          language, 
          format
        })
        const data = await show.save()
        responseSuccess(res, 'show created successfully', data)
      }
    } else {
      responseError(res, "you don't have access to create a show", 404)
    }
  } catch (error) {
    console.log(error)
  }
}