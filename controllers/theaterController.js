const { default: mongoose } = require("mongoose")
const theaterModel = require("../models/theaterModel")
const { checkAdmin, createUserBookingHistory } = require("../services/userService")
const { responseSuccess, responseError, responseInternalServerError } = require("../utils/responseHandlers")
const screenModel = require("../models/screenModel")

exports.addTheater = async (req, res)=> {
  const {name, location,  facilities, contactInfo} = req?.body

  console.log('req.body', req?.body)
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const check_theater_name = await theaterModel.findOne({name : name})
      if(check_theater_name) {
        responseError(res, "theater already exists with this name", 404)
      } else {
        const theater = new theaterModel({
          name : name,
          location : {
            city : location?.city,
            address : location?.address,
            state : location?.state,
            pincode : location?.pincode,
          },
          facilities : facilities,
          contactInfo: {
            phone: contactInfo?.phone,
            email: contactInfo?.email
          }
        })
        const data = await theater.save()
        responseSuccess(res, "theater added successfully", data)
      }
    } else {
      responseError(res, "you don't have access to add new theater", 404)
    }
    
  } catch (error) {
    responseInternalServerError(res)
    console.log('errorrrrrrrrrrrrrr', error)
  }
}

exports.addTheaterScreens = async (req, res)=> {
  const {screenNumber, theaterId, seatsArray} = req?.body
  // const theaterId = req.query.theaterId

  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const find_theater = await theaterModel.findOne({_id : theaterId})
      console.log('find_theater', find_theater)
      if(!find_theater) {
        responseError(res, "theater not exists", 404)
      } else {
      const check_if_screen_already_exists = await screenModel.findOne({screenNumber : screenNumber})
      if(check_if_screen_already_exists) {
        responseError(res, "screen already exists", 404)
      }else {
        const theaterScreen = new screenModel({
          screenNumber,
          theaterId,
          seatsArray
        })
        const data = await theaterScreen.save()
        responseSuccess(res, "theater screen added successfully", data)
      }

      }
    } else {
      responseError(res, "you don't have access to add new theater", 404)
    }
    
  } catch (error) {
    responseInternalServerError(res)
    console.log('errorrrrrrrrrrrrrr', error)
  }
}

exports.addScreenSeats = async (req, res)=> {
  const {theaterId, screenId, seatsArray} = req?.body

  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const find_theater = await theaterModel.findOne({_id : theaterId})
      if(!find_theater) {
        responseError(res, "theater not exists", 404)
      } else {
      const find_screen = await screenModel.findOne({_id : screenId})
      if(!find_screen) {
        responseError(res, "screen not exists", 404)
      }else {
        find_screen?.seatsArray?.push(...seatsArray)
        const data = await find_screen?.save()
        responseSuccess(res, "seats added successfully", data)
      }
      }
    } else {
      responseError(res, "you don't have access to add new seat", 404)
    }
    
  } catch (error) {
    responseInternalServerError(res)
    console.log('errorrrrrrrrrrrrrr', error)
  }
}

exports.bookSeat = async (req, res)=> {
  const {theaterId, screenId, seatIds} = req?.body

  try {
    const check_is_admin = await checkAdmin(req)

    if(check_is_admin) {
      const find_theater = await theaterModel.findOne({_id : theaterId})

      if(!find_theater) {
        responseError(res, "theater not exists", 404)
      } else {
      const find_screen = await screenModel.findOne({_id : screenId})

      if(!find_screen) {
        responseError(res, "screen not exists", 404)
      }else {

         // Check if any seat is already unavailable (isAvailable: false)
          const seats = await screenModel.findOne(
            { _id: screenId },
            { seatsArray: { $elemMatch: { _id: { $in: seatIds }, isAvailable: false } } }
          );

          // If any seat in the list is already unavailable, return an error
          if (seats && seats?.seatsArray?.length > 0) {
            responseError(res, "One or more seats are already unavailable.", 400)
          }
        const updatedScreen = await screenModel.findOneAndUpdate(
          { _id: screenId, "seatsArray._id": { $in: seatIds } },  // Match any seat in seatsArray whose _id is in seatIds
          { $set: { "seatsArray.$[seat].isAvailable": false } },  // Update the isAvailable field
          {
            arrayFilters: [{ "seat._id": { $in: seatIds } }],  // Use array filter to match multiple seats by _id
            new: true  // Return the updated document
          }
        );
        const createBookingHistory = await createUserBookingHistory(check_is_admin?._id, '66da9cc5c87171dca796c527', theaterId, screenId, seatIds)
        responseSuccess(res, "seats added successfully", updatedScreen)
      }
      }
    } else {
      responseError(res, "you don't have access to add new seat", 404)
    }
    
  } catch (error) {
    responseInternalServerError(res)
    console.log('errorrrrrrrrrrrrrr', error)
  }
}

exports.getTheater = async (req, res) => {
  try {
    const pipeline = [
      {
        '$match': {
          'isDeleted': false
        }
      }, {
        '$lookup': {
          'from': 'screens', 
          'localField': '_id', 
          'foreignField': 'theaterId', 
          'as': 'totalScreens'
        }
      }, {
        '$set': {
          'totalScreens': {
            '$size': '$totalScreens'
          }
        }
      }
    ]
    
    const data = await theaterModel.aggregate(pipeline)
    responseSuccess(res, 'Theater list found succesfully', data)
  } catch (error) {
    console.log('error', error)
    responseInternalServerError(res)
  }
}

exports.getSingleTheater = async (req, res) => {
  const theaterId = req.query.theaterId;
  try {
    const pipeline = [
      {
        '$match': {
          'isDeleted': false
        }
      } ,{
        '$match': {
          '_id': new mongoose.Types.ObjectId(theaterId)
        }
      }, {
        '$lookup': {
          'from': 'screens', 
          'localField': '_id', 
          'foreignField': 'theaterId', 
          'as': 'screens'
        }
      }, {
        '$set': {
          'totalScreens': {
            '$size': '$screens'
          }
        }
      }, {
        '$addFields': {
          'screens': {
            '$ifNull': [
              {
                '$map': {
                  'input': '$screens', 
                  'as': 'screen', 
                  'in': {
                    '$mergeObjects': [
                      '$$screen', {
                        'seatCount': {
                          '$cond': {
                            'if': {
                              '$isArray': '$$screen.seatsArray'
                            }, 
                            'then': {
                              '$size': '$$screen.seatsArray'
                            }, 
                            'else': 0
                          }
                        }
                      }
                    ]
                  }
                }
              }, []
            ]
          }
        }
      }, {
        '$project': {
          '_id': 1, 
          'name': 1, 
          'location': 1, 
          'totalScreens': 1, 
          'facilities': 1, 
          'contactInfo': 1, 
          'createdAt': 1, 
          'updatedAt': 1, 
          'screens': {
            '_id': 1, 
            'screenNumber': 1, 
            'seatCount': 1
          }
        }
      }
    ]
    
    const data = await theaterModel.aggregate(pipeline)
    responseSuccess(res, 'Theater details found succesfully', data)
  } catch (error) {
    console.log('error', error)
    responseInternalServerError(res)
  }
}

exports.deleteTheater = async (req, res)=> {
  const theaterId = req.query.theaterId;
  try {
    const check_is_admin = await checkAdmin(req)

    if(check_is_admin) {
      const data = await theaterModel.findOneAndUpdate({_id: theaterId, isDeleted : false}, {isDeleted: true}, {new: true})
      if(data) {
        responseSuccess(res, 'theater deleted successfully', data)
      } else {
        responseError(res, "theater not exist", 400)
      }
    } else {
      responseError(res, "you don't have access to delete theater", 404)
    }
    
  } catch (error) {
    console.log('error', error)
    responseInternalServerError(res)
  }
}

exports.editTheater = async (req, res)=> {
  const theaterId = req.query.theaterId
  const {_id, ...updatedData} = req?.body
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const isTheaterExist = await theaterModel.findOne({'_id': theaterId})
      if(!isTheaterExist) {
        responseError(res, "Theater doesn't exists", 400)
      } else {
      const isTheaterNameExist = await theaterModel.findOne({'name': updatedData?.name})
        if(isTheaterNameExist) {
        responseError(res, "theater name already exists", 400)
        } else {
          const theater = {
            name : updatedData?.name,
            location : {
              city : updatedData?.location?.city,
              address : updatedData?.location?.address,
              state : updatedData?.location?.state,
              pincode : updatedData?.location?.pincode,
            },
            facilities : updatedData?.facilities,
            contactInfo: {
              phone: updatedData?.contactInfo?.phone,
              email: updatedData?.contactInfo?.email
            }
          }
          const data = await theaterModel.findOneAndUpdate({_id: theaterId}, theater, {new: true})
          responseSuccess(res, "theater edited successfully", data)
        }
      }
    } else {
      responseError(res, "you don't have access to edit theater", 404)
    }
    
  } catch (error) {
    console.log('error', error)
    responseInternalServerError(res)
  }
}