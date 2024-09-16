const { getGenere } = require("../services/genereService")
const { checkAdmin } = require("../services/userService")
const { responseError, responseSuccess } = require("../utils/responseHandlers")
const GenereModel = require('./../models/genereModel')

exports.addGenere = async (req, res)=> {
  const {title} = req.body
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const genere = await getGenere(title)
      if(genere) {
        responseError(res, "genere already exists", 400)
      }else {
        const newGenere = new GenereModel({
          title
        })
        await newGenere.save()
        responseSuccess(res, "genere added successfully")
      }

    }else {
      responseError(res, "you don't have access to add new genere", 404)
    }
    
  } catch (error) {
    responseError(error, "error", 400)
  }
}

exports.getGenere = async (req, res)=> {
  try {
    const data = await GenereModel.find({isDeleted : false})
    responseSuccess(res, "genere list", data)
  } catch (error) {
    
  }
}

exports.deleteGenere = async (req, res)=> {
  const genereId = req?.query?.genereId
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const genere = await GenereModel.findOne({_id : genereId, isDeleted : false})
      console.log(genere)
      if(genere) {
        const data = await GenereModel.updateOne(
          {_id: genereId},
          {isDeleted: true},
          {new: true}
        )
        responseSuccess(res, "genere deleted successfully")
      } else {
        responseError(res, "genere not exists", 400)
      }
    } else {
      responseError(res, "you don't have access to delete genere", 404)
    }
  } catch (error) {
    console.log('error', error)
  }
}

exports.updateGenere = async (req, res)=> {
  const genereId = req?.query?.genereId
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const genere = await GenereModel.findOne({_id : genereId, isDeleted : false})
      console.log(genere)
      if(genere) {
        const data = await GenereModel.updateOne(
          {_id: genereId},
          {title: req?.body?.title},
          {new: true}
        )
        responseSuccess(res, "genere updated successfully")
      } else {
        responseError(res, "genere not exists", 400)
      }
    } else {
      responseError(res, "you don't have access to update genere", 404)
    }
  } catch (error) {
    console.log('error', error)
  }
}