const mongoose = require("mongoose");
const bookingSchema = new mongoose.Schema({
    turf:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Turf",
        required:true
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    date:{
        type:String,
        required:true
    },

    slot:{
        type:String,
        required:true
    },

    status:{
        type:String,
        enum:["booked","cancelled"],
        default:"booked"
    }
});

bookingSchema.index(
{
    turf:1,
    date:1,
    slot:1
},
{
    unique:true
});


module.exports = mongoose.model("Booking" , bookingSchema);