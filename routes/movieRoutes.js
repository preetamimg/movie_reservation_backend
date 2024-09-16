const express = require('express')
const { addMovie, getMovies, getSingleMovie, deleteMovie, editMovie } = require('../controllers/movieController')
const { authMiddleware } = require('../middlewares/AuthMiddleware')
const { uploadMiddleware } = require('../middlewares/UploadImage')
const { movieSchema } = require('../validations/movieValidation')
const { validateField } = require('../middlewares/ValidationMiddleware')


const router = express.Router()

router.post('/addMovie', authMiddleware, uploadMiddleware.fields([
  { name: "posterImage", maxCount: 1 },
]), validateField(movieSchema), addMovie)

router.get('/getMovies', getMovies)
router.get('/getSingleMovie', getSingleMovie)
router.get('/deleteMovie', authMiddleware, deleteMovie)
router.post('/editMovie', authMiddleware, uploadMiddleware.fields([
  { name: "posterImage", maxCount: 1 },
]), validateField(movieSchema), editMovie)



module.exports = router