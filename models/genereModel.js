const { boolean } = require("joi");
const { default: mongoose, Schema } = require("mongoose");

const genereSchema = new mongoose.Schema({
  title : {
    required : true,
    type: String
  },
  isDeleted : {
    default : false,
    type: Boolean
  },
}, {timestamps: true})

const GenereModel = mongoose.model('geners', genereSchema)
module.exports = GenereModel