const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
  name:String,
  location:String,
  price:Number
});

module.exports = mongoose.model('Turf' , turfSchema);