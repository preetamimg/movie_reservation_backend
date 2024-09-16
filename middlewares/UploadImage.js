const multer = require("multer")


exports.uploadMiddleware = multer({
  storage: multer.diskStorage({
      destination: function(req, file, callBackFun) {
          callBackFun(null, "./public")
      },
      filename: function(req, file, callBackFun) {
          callBackFun(null, `/images/${Date.now()}-${file.originalname}`)
      }
  })
})
