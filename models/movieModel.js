const { default: mongoose, Schema } = require("mongoose");

const movieSchema = new mongoose.Schema({
  title : {
    required : true,
    type: String
  },
  description : {
    required : true,
    type: String
  },
  posterImage : {
    required : true,
    type: String
  },
  trailerUrl : {
    type: String
  },
  duration : {
    type: Number
  },
  releaseDate : {
    type: String
  },
  generes : [{
    required : true,
    type: Schema.Types.ObjectId,
    ref: "genere"
  }],
  language: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,    
    min: 0,
    max: 10,
    default: null,
  },
  isDeleted: {
    type: Boolean,   
    default: false,
  },
}, {timestamps: true})

const MovieModel = mongoose.model('movies', movieSchema)
module.exports = MovieModel