const BookingModel = require("../models/userBookingHistoryModel");
const UserModel = require("../models/userModel");
const { responseError } = require("../utils/responseHandlers");

exports.checkAdmin = async (req)=> {
  const {id} = req.auth;
  try {
    const user = await UserModel.findOne({_id: id, role: 'admin'})
    return user
  } catch (error) {
    responseError(error, "error", 404)
  }
}


exports.getUserDetails = async (req)=> {
  const {id} = req.auth;
  try {
    const user = await UserModel.findOne({_id: id})
    return user
  } catch (error) {
    responseError(error, "error", 404)
  }
}


exports.getUser = async (id)=> {
  try {
    const user = await UserModel.findOne({_id: id})
    return user
  } catch (error) {
    responseError(error, "error", 404)
  }
}

exports.createUserBookingHistory = async (userId, movieId, theaterId, screenId, SeatIds) => {
  console.log('userId, movieId, theaterId, screenId, SeatIds', userId, movieId, theaterId, screenId, SeatIds)
  try {
    const newBooking = new BookingModel({
      userId,  
      movieId,
      theaterId, 
      screenId,  
      SeatIds     
    });
    const data = await newBooking.save()
    return data

  } catch (error) {
    console.log('errorrrrrrrrrrrrrr', error)
  }
}