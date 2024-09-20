const { default: mongoose, Schema } = require("mongoose");

const userSchema = new mongoose.Schema({
  name : {
    type: String
  },
  email : {
    required : true,
    type: String
  },
  password : {
    required : true,
    type: String
  },
  role : {
    required : true,
    default: 'user',
    type: String
  },
  wishlist : [{
    required : true,
    type: Schema.Types.ObjectId,
    ref: "movies"
  }],
}, {timestamps: true})

const UserModel = mongoose.model('users', userSchema)
module.exports = UserModel