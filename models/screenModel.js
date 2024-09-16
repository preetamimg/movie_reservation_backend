const { default: mongoose, Schema } = require("mongoose");

const screenSchema = new mongoose.Schema({
  theaterId : {
    required : true,
    type: Schema.Types.ObjectId,
    ref: 'theater'
  },
  screenNumber: { type: Number, required: true },
  // totalSeats: { type: Number, required: true },
  seatsArray : [
    {
      seatNumber: { type: String, required: true },
      isAvailable: { type: Boolean, default: true },
      type: { type: String, enum: ['regular', 'premium', 'recliner'], default: 'regular' },
      price: { type: Number, required: true } 
    }
  ]
});

const screenModel = mongoose.model('screens', screenSchema)
module.exports = screenModel