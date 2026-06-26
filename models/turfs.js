const mongoose = require("mongoose");
const Review = require("./review");
const Schema = mongoose.Schema;

const turfSchema = new mongoose.Schema({

  name:{
    type:String,
    required:true
  },

  location:{
    type:String,
    required:true
  },

  price:{
   type: Number,
   required:true
  },

  image:{
    url:String,
    filename:String,
  },

  description:{
    type:String,
    required:true
  },

  owner:{
    type:Schema.Types.ObjectId,
    ref:"User"
  },

  reviews:[
    {
      type:Schema.Types.ObjectId,
      ref:"Review"
    }
  ]

});

module.exports = mongoose.model('Turf' , turfSchema);