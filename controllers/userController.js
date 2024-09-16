const UserModel = require("../models/userModel")
const bcrypt = require("bcrypt")
const jwt = require('jsonwebtoken')
const dotenv = require('dotenv'); 
const { checkAdmin, getUser } = require("../services/userService");
const { responseError, responseSuccess } = require("../utils/responseHandlers");

dotenv.config();


exports.RegisterUser = async (req, res)=> {
  const {email, password} = req?.body
  try {
    // check if email already registered
    const oldUser = await UserModel.findOne({email})
    console.log('oldUser', oldUser)
    if(oldUser) {
      res.status(404).json({
        success : false,
        message : 'Email already exists'
      })
    } else {
        // hash the password
        // const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, 10)
        // const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = new UserModel({
          email,
          password : hashedPassword
        })
        console.log('process.env.TOKEN_SECRET_KEY', process.env.TOKEN_SECRET_KEY)
        const user = await newUser.save()
        const token = jwt.sign({
          id: user?._id,
        }, process.env.TOKEN_SECRET_KEY, {expiresIn: '20h'})
        // note : token db m save krwa lena chyche

        res.status(200).json({
          user,
          token,
          success: true,
          message: 'User registered successfully'
        })

    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

exports.LoginUser = async (req, res)=> {
  const {email, password} = req.body
  try {
    const checkUser = await UserModel.findOne({email})
    if(!checkUser) {
      res.status(400).json({
        success: false,
        message: 'User not found'
      })
    } else {
      const matchPassword = await bcrypt.compare(password, checkUser.password)
      if(!matchPassword) {
        res.status(404).json({
          success: false,
          message: 'wrong password'
        })
      } else {
        const token = jwt.sign({
          id: checkUser?._id,
        }, process.env.TOKEN_SECRET_KEY, {expiresIn: '20h'})

        res.status(200).json({
          checkUser,
          token,
          success: true,
          message: 'Login successfully'
        })
      }
    }
  } catch (error) {
    res.status(500).json({message: error.message})
  }
}

exports.ChangeUserRole = async (req, res) => {
  const userId = req.query.userId
  try {
    const check_is_admin = await checkAdmin(req)
    if(check_is_admin) {
      const user = await getUser(userId)
      if(user) {
        await UserModel.updateOne(
          {_id: userId}, 
          {role : user?.role === "user" ? "admin" : 'user'},
          {new : true})
        responseSuccess(res, "user role changed successfully")
      }else {
        responseError(res, "user not found", 400)
      }

    } else {
      responseError(res, "you don't have access to edit user role", 404)
    }
  } catch (error) {
    responseError(error, "error", 400)

  }
} 