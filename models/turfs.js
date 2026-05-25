const mongoose = require("mongoose");

const turfSchema = new mongoose.Schema({
  name:{
   type: String,
   required:true
  },
  location:String,
  price:Number,
  image:{
    type:String,
    default:"https://5.imimg.com/data5/SELLER/Default/2022/1/ZW/MQ/CO/15068556/box-cricket-500x500.png",
    set:(v)=>
      v===""?"https://5.imimg.com/data5/SELLER/Default/2022/1/ZW/MQ/CO/15068556/box-cricket-500x500.png":v
  }
});

module.exports = mongoose.model('Turf' , turfSchema);