
const { default: mongoose, Schema } = require("mongoose");

const showSchema = mongoose.Schema({
  timeAndDate : {
    required : true,
    type: Date
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
  language: {
    type: String, 
    required: true
  },
  format: {
    type: String,
    required: true
  },
  isDeleted : {
    type: Boolean,
    default: false
  },
  isBookingClosed : {
    type: Boolean,
    default: false
  },
}, {timestamps: true})

const showModel = mongoose.model('show', showSchema)
module.exports = showModel