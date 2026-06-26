const User = require('../models/users');
const Turf = require("../models/turfs.js");
const Booking = require("../models/booking.js");

module.exports.owner = (req,res)=>{

    if(!req.isAuthenticated()){
        return res.redirect("/user/login");
    }

    if(req.user.role !== "owner"){
        req.flash(
            "error",
            "Please login as a turf owner"
        );

        return res.redirect("/home");
    }

    res.redirect("/owner/dashboard");
};

module.exports.dashboard = async(req,res)=>{

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
    };

module.exports.createTurf =  (req,res)=>{
    res.render("owner/new");
};

module.exports.postNewTurf = async(req,res)=>{
        let url = req.file.path;
        let filename = req.file.filename;

        const turf = new Turf(req.body.turf);

        turf.owner = req.user._id;

        turf.image = {url , filename};

        await turf.save();

        req.flash(
            "success",
            "Turf created successfully!"
        );

        res.redirect("/owner/dashboard");
    };

module.exports.editTurf = async(req , res )=>{
    let {id} = req.params;
    const turf = await Turf.findById(id);
    
    res.render("owner/edit" , {turf});
};

module.exports.postEditTurf = async(req,res)=>{
    let {id} = req.params;

    let turf =  await Turf.findByIdAndUpdate(id , {...req.body.turf});
    
    if(typeof req.file != "undefined"){
    let url = req.file.path;
    let filename = req.file.filename;
    turf.image = {url , filename};
    await turf.save();
    }

    req.flash(
            "success",
            "Turf updated successfully!"
        );

    res.redirect("/owner/dashboard");
}

module.exports.destroyTurf = async(req , res)=>{
    let {id} = req.params;
    await Booking.deleteMany({
        turf:id
    });
    await Turf.findByIdAndDelete(id);
    req.flash('success' , "Turf Deleted!!");
    res.redirect("/owner/dashboard");
};

module.exports.getBookingDetails = async(req,res)=>{

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