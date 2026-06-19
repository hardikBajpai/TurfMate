const express = require("express");
const router = express.Router();
const User = require('../models/users');
const wrapAsync = require('../utils/wrapAsync');
const passport = require("passport");
const Turf = require("../models/turfs.js");
const Booking = require("../models/booking.js");

const {isLoggedIn, saveRedirectUrl, isReviewAuthor , isOwner} = require("../middleware.js");

router.get("/",(req,res)=>{

    if(!req.isAuthenticated()){
        return res.redirect("/user/login");
    }

    if(req.user.role !== "owner"){
        req.flash(
            "error",
            "Please login as a turf owner"
        );

        return res.redirect("/");
    }

    res.redirect("/owner/dashboard");
});


router.get(
    "/dashboard",
    isLoggedIn,
    isOwner,
    async(req,res)=>{

        const turfs = await Turf.find({
            owner:req.user._id
        });

        const today =
            new Date()
            .toISOString()
            .split("T")[0];

        const bookings =
            await Booking.find({
                turf:{
                    $in: turfs.map(
                        turf => turf._id
                    )
                },
                date:today,
                status:"booked"
            })
            .populate("user")
            .populate("turf");

        res.render(
            "owner/dashboard",
            {
                turfs,
                bookings
            }
        );
    }
);

module.exports = router;
