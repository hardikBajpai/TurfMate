const express = require("express");
const router = express.Router();
const wrapAsync = require('../utils/wrapAsync');
const Turf = require('../models/turfs');
const ExpressError = require('../utils/ExpressError');


//Index Route
router.get('/' , wrapAsync(async(req , res)=>{
 const allTurfs = await Turf.find({});
 res.render("turfs/index.ejs" , {allTurfs});
}))

//Show Route
router.get('/:id' , wrapAsync(async(req , res)=>{
  let {id} = req.params;
  let turf = await Turf.findById(id).populate({path : "reviews" , populate:{path:"author"}});
  res.render("turfs/show.ejs" , {turf});
}))

module.exports = router;