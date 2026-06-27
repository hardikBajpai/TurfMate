const Turf = require('../models/turfs');
const ExpressError = require('../utils/ExpressError');
const Booking = require("../models/booking");
const moment = require('moment-timezone');
const IST = 'Asia/Kolkata';

const { model } = require("mongoose");

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

module.exports.index = async(req , res)=>{
 const allTurfs = await Turf.find({});
 res.render("turfs/index.ejs" , {allTurfs});
};

module.exports.showBooking = async (req, res) => {

    const bookings = await Booking.find({
        user: req.user._id
    })
    .populate("turf")
    .sort({ date: 1 });

    res.render("bookings/index", {
        bookings
    });
};

module.exports.destroyBooking = async (req, res) => {

    const booking = await Booking.findById(req.params.bookingId);

    if (!booking) {
        req.flash("error", "Booking not found");
        return res.redirect("/turfs/bookings");
    }

    booking.status = "cancelled";

    await booking.save();
    await Booking.findByIdAndDelete(req.params.bookingId);

    req.flash(
        "success",
        "Booking cancelled successfully"
    );

    res.redirect("/turfs/bookings");
};

module.exports.show = async(req , res)=>{
  let {id} = req.params;
  let turf = await Turf.findById(id).populate({path : "reviews" , populate:{path:"author"}});
  res.render("turfs/show", {
        turf,
        allSlots: [],
        bookedSlots: [],
        selectedDate: null,
        moment
    });
};

module.exports.fetchSlot = async(req , res)=>{
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
        allSlots: ALL_SLOTS,
        moment
    });
};

module.exports.bookSlot = async (req, res) => {

    const { date, slots } = req.body;

    if (!slots) {
        req.flash("error", "Please select at least one slot");
        return res.redirect(
            `/turfs/${req.params.id}/slots?date=${date}`
        );
    }

    const selectedSlots = Array.isArray(slots)
        ? slots
        : [slots];

    const now = moment().tz(IST);;

for(let slot of selectedSlots){

    const startTime = slot.split(" - ")[0];

    const bookingDateTime = moment(
        `${date} ${startTime}`,
        "YYYY-MM-DD hh:mm A",
        IST
    );

    if(bookingDateTime.isBefore(now)){

        req.flash(
            "error",
            `${slot} has already passed`
        );

        return res.redirect(
            `/turfs/${req.params.id}/slots?date=${date}`
        );
    }
}

    const existingBookings = await Booking.find({
        turf: req.params.id,
        date,
        slot: { $in: selectedSlots },
        status: "booked"
    });

    if (existingBookings.length > 0) {

        const bookedSlotNames = existingBookings.map(
            booking => booking.slot
        );

        req.flash(
            "error",
            `Already booked: ${bookedSlotNames.join(", ")}`
        );

        return res.redirect(
            `/turfs/${req.params.id}/slots?date=${date}`
        );
    }


    const bookings = selectedSlots.map(slot => ({
        turf: req.params.id,
        user: req.user._id,
        date,
        slot,
        status: "booked"
    }));

    await Booking.insertMany(bookings);

    req.flash(
        "success",
        `${selectedSlots.length} slot(s) booked successfully`
    );

    res.redirect(`/turfs/${req.params.id}`);
}



