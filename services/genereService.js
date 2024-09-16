const genereModel = require("../models/genereModel");
const { responseError } = require("../utils/responseHandlers");

exports.getGenere = async (title)=> {
  try {
    const genere = await genereModel.findOne({title, isDeleted: false})
    return genere
  } catch (error) {
    responseError(error, "error", 404)
  }
}