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
    type:String,
    default:"https://5.imimg.com/data5/SELLER/Default/2022/1/ZW/MQ/CO/15068556/box-cricket-500x500.png",
    set:(v)=>
      v === ""
      ? "https://5.imimg.com/data5/SELLER/Default/2022/1/ZW/MQ/CO/15068556/box-cricket-500x500.png"
      : v
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