const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Turf = require('../models/turfs');
const ExpressError = require('../utils/ExpressError');
const Booking = require("../models/booking");

const ALL_SLOTS = [
    "06:00 AM - 07:00 AM",
    "07:00 AM - 08:00 AM",
    "08:00 AM - 09:00 AM",
    "09:00 AM - 10:00 AM",
    "10:00 AM - 11:00 AM",
    "11:00 AM - 12:00 PM",
    "12:00 PM - 01:00 PM",
    "01:00 PM - 02:00 PM",
    "02:00 PM - 03:00 PM",
    "03:00 PM - 04:00 PM",
    "04:00 PM - 05:00 PM",
    "05:00 PM - 06:00 PM",
    "06:00 PM - 07:00 PM",
    "07:00 PM - 08:00 PM",
    "08:00 PM - 09:00 PM",
    "09:00 PM - 10:00 PM",
    "10:00 PM - 11:00 PM"
];


//Index Route
router.get('/' , wrapAsync(async(req , res)=>{
 const allTurfs = await Turf.find({});
 res.render("turfs/index.ejs" , {allTurfs});
}))

//Show Route
router.get('/:id' , wrapAsync(async(req , res)=>{
  let {id} = req.params;
  let turf = await Turf.findById(id).populate({path : "reviews" , populate:{path:"author"}});
  res.render("turfs/show", {
        turf,
        allSlots: [],
        bookedSlots: [],
        selectedDate: null
    });
}))

//GET slots
router.get('/:id/slots' , async(req , res)=>{
    const turfId = req.params.id;
    const selectedDate = req.query.date;

    const turf = await Turf.findById(turfId)
    .populate({
        path: "reviews",
        populate: {
            path: "author"
        }
    });

    const bookings = await Booking.find({
        turf: turfId,
        date: selectedDate,
        status: "booked"
    });

    const bookedSlots = bookings.map(
        booking => booking.slot
    );

    res.render("turfs/show", {
        turf,
        selectedDate,
        bookedSlots,
        allSlots: ALL_SLOTS
    });

    
})

module.exports = router;