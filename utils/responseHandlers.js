/// success response
exports.responseSuccess = (res, message, data, success = true, status = 200) => {
  const payload = {
      success,
      status
  }
  if (message) payload.message = message
  if (data) payload.data = data
  res.status(status).json(payload)
}

//error response
exports.responseError = (res, message, status) => {
  const payload = {
      success: false,
      status,
      message: message
  }
  // console.log('in error',payload)
  res.status(status).json(payload)
}


//Internal server error
exports.responseInternalServerError = (res) => {
  const payload = {
      success: false,
      status: 500,
      message: "Internal Server Error"
  }
  res.status(500).json(payload)
}