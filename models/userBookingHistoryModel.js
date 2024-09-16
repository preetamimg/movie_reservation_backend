const { ref, required } = require("joi");
const { default: mongoose, Schema } = require("mongoose");

const bookingHistorySchema = new mongoose.Schema({
  userId : {
    type : Schema.Types.ObjectId,
    ref: 'users',
    required : true
  },
  movieId : {
    type : Schema.Types.ObjectId,
    ref: 'movies',
    required : true
  },
  theaterId : {
    type : Schema.Types.ObjectId,
    ref: 'theater',
    required : true
  },
  screenId : {
    type : Schema.Types.ObjectId,
    ref: 'screens',
    required : true
  },
  SeatIds : [{
    type : Schema.Types.ObjectId,
    ref: 'screens',
    required : true
  }],
  // showId : {
  //   type : Schema.Types.ObjectId,
  //   ref: 'shows',
  //   required : true
  // }
}, {timestamps: true})

const BookingModel = mongoose.model('userBookingHistory', bookingHistorySchema)
module.exports = BookingModel