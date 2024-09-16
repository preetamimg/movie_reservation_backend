const express = require('express')
const { authMiddleware } = require('../middlewares/AuthMiddleware')
const { addTheater, addTheaterScreens, addScreenSeats, bookSeat, getTheater, getSingleTheater, deleteTheater, editTheater } = require('../controllers/theaterController')

const router = express.Router()

router.post('/addTheater', authMiddleware, addTheater)
router.get('/getTheater', getTheater)
router.get('/getSingleTheater', getSingleTheater)
router.get('/deleteTheater',authMiddleware, deleteTheater)
router.post('/editTheater', authMiddleware, editTheater)
router.post('/addTheaterScreens', authMiddleware, addTheaterScreens)
router.post('/addScreenSeats', authMiddleware, addScreenSeats)
router.post('/bookSeat', authMiddleware, bookSeat)


module.exports = router