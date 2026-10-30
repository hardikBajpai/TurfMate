const Turf = require('../models/turfs');
const ExpressError = require('../utils/ExpressError');
const Booking = require("../models/booking");
const moment = require('moment-timezone');
const IST = 'Asia/Kolkata';

const { model } = require("mongoose");

const ALL_SLOTS = [
    "06:00 AM - 08:00 AM",
    "08:00 AM - 10:00 AM",
    "10:00 AM - 12:00 PM",
    "12:00 PM - 02:00 PM",
    "02:00 PM - 04:00 PM",
    "04:00 PM - 06:00 PM",
    "06:00 PM - 08:00 PM",
    "08:00 PM - 10:00 PM"
];

const aiClient = require('../utils/aiClient');

module.exports.index = async (req, res) => {
    const allTurfs = await Turf.find({});
    res.render("turfs/index.ejs", { allTurfs });
};

const ALLOWED_LOCATIONS = [
    "Swaroop Nagar, Kanpur",
    "Kidwai Nagar, Kanpur",
    "Harsh Nagar, Kanpur",
    "Govind Nagar, Kanpur",
    "Hazratganj, Lucknow",
    "Aliganj, Lucknow",
    "Kanpur",
    "Lucknow"
];

module.exports.recommendPage = async (req, res) => {
    const preferences = {
        sport: req.body?.sport || req.query?.sport || "cricket",
        budget: Number(req.body?.budget || req.query?.budget) || 1200,
        location: (req.body?.location || req.query?.location || ALLOWED_LOCATIONS[0]).trim(),
        time: (req.body?.time || req.query?.time || "").trim(),
        date: req.body?.date || req.query?.date || "",
        top_k: 6
    };

    if (!ALLOWED_LOCATIONS.includes(preferences.location)) {
        preferences.location = ALLOWED_LOCATIONS[0];
    }

    const now = moment().tz(IST);
    const todayIST = now.format('YYYY-MM-DD');

    if (preferences.date && preferences.date < todayIST) {
        req.flash("error", "Playing date cannot be in the past. Updated to today.");
        preferences.date = todayIST;
    } else if (!preferences.date) {
        preferences.date = todayIST;
    }

    const isToday = preferences.date === todayIST;

    const availableSlots = ALL_SLOTS.filter(slot => {
        if (!isToday) return true;
        const startTime = slot.split(" - ")[0];
        const startTime24 = moment(startTime, "hh:mm A").format("HH:mm");
        const slotDateTime = moment.tz(
            `${todayIST} ${startTime24}`,
            "YYYY-MM-DD HH:mm",
            IST
        );
        return slotDateTime.isSameOrAfter(now);
    });

    if (preferences.time && !availableSlots.includes(preferences.time)) {
        preferences.time = "";
    }

    let allTurfs = [];
    try {
        allTurfs = await Turf.find({}).lean();
    } catch (err) {
        console.warn("Error fetching turfs for recommendations:", err.message);
    }

    let bookedTurfSlots = {};
    if (preferences.date) {
        try {
            const bookings = await Booking.find({ date: preferences.date, status: "booked" });
            bookings.forEach(b => {
                const tid = b.turf.toString();
                if (!bookedTurfSlots[tid]) bookedTurfSlots[tid] = [];
                bookedTurfSlots[tid].push(b.slot);
            });
        } catch (bErr) {
            console.warn("Could not check bookings for date:", bErr.message);
        }
    }
    preferences.booked_turf_slots = bookedTurfSlots;

    const recommendations = await aiClient.getRecommendations(preferences, allTurfs);

    res.render("turfs/recommend.ejs", {
        recommendations,
        preferences,
        minDate: todayIST,
        allowedLocations: ALLOWED_LOCATIONS,
        allSlots: ALL_SLOTS,
        availableSlots
    });
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

module.exports.show = async (req, res) => {
    let { id } = req.params;
    let turf = await Turf.findById(id).populate({ path: "reviews", populate: { path: "author" } });
    res.render("turfs/show", {
        turf,
        allSlots: [],
        bookedSlots: [],
        selectedDate: null,
        moment
    });
};

module.exports.fetchSlot = async (req, res) => {
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

    const now = moment().tz(IST);



    for (let slot of selectedSlots) {

        const startTime = slot.split(" - ")[0];

        const startTime24 = moment(startTime, "hh:mm A").format("HH:mm"); // "22:00"

        const bookingDateTime = moment.tz(
            `${date} ${startTime24}`,
            "YYYY-MM-DD HH:mm",
            IST
        );


        if (bookingDateTime.isBefore(now)) {

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



