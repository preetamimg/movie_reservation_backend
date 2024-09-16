const { required } = require("joi");
const { default: mongoose, Schema } = require("mongoose");

const theaterSchema = new mongoose.Schema({
  name : {
    type: String,
    required: true
  },
  location : {
    city : {
      type: String,
      required: true
    },
    state : {
      type: String,
      required: true
    },
    address : {
      type: String,
      required: true
    },
    pincode : {
      type: String,
      required: true
    },
  }, 
  // totalScreens : {
  //   type: Number,
  //   required: true
  // },
    isDeleted : {
    type: Boolean,
    default: false
  },
  facilities: [],
  contactInfo: {
    phone: { type: String },
    email: { type: String }
  },
}, {timestamps: true})

const theaterModel = mongoose.model('theater', theaterSchema)
module.exports = theaterModel
