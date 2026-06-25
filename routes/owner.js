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

         let todayRevenue = 0;

        for(let booking of bookings){

            todayRevenue +=
                booking.turf.price;
        }

        res.render(
            "owner/dashboard",
            {
                turfs,
                bookings,
                todayRevenue
            }
        );
    }
);

router.get('/new'  , (req,res)=>{
    res.render("owner/new");
});

router.post(
    "/turfs",
    isLoggedIn,
    isOwner,
    async(req,res)=>{
        const turf = new Turf(req.body.turf);

        turf.owner = req.user._id;

        await turf.save();

        req.flash(
            "success",
            "Turf created successfully!"
        );

        res.redirect("/owner/dashboard");
    }
);

router.get("/:id/edit" , async(req , res )=>{
    let {id} = req.params;
    const turf = await Turf.findById(id);
    
    res.render("owner/edit" , {turf});
})

router.post("/:id" , async(req,res)=>{
    let {id} = req.params;
    await Turf.findByIdAndUpdate(id , {...req.body.turf});
    res.redirect("/owner/dashboard");
})

router.get('/:id/delete' , async(req , res)=>{
    let {id} = req.params;
    await Booking.deleteMany({
        turf:id
    });
    await Turf.findByIdAndDelete(id);
    req.flash('success' , "Turf Deleted!!");
    res.redirect("/owner/dashboard");
})

router.get(
    "/bookings",
    isLoggedIn,
    isOwner,
    async(req,res)=>{

        const turfs = await Turf.find({
            owner:req.user._id
        });

        const bookings = await Booking.find({
            turf:{
                $in: turfs.map(
                    turf => turf._id
                )
            }
        })
        .populate("user")
        .populate("turf")
        .sort({ date:-1 });

        res.render(
            "owner/booking",
            { bookings }
        );
    }
);
module.exports = router;
