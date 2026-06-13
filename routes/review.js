const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const Turf = require('../models/turfs');
const ExpressError = require('../utils/ExpressError');
const Review = require('../models/review')
const {reviewSchema} = require("../schema.js");

//validate Review Middleware
const validateReview = (req , res , next)=>{
  let {error} = reviewSchema.validate(req.body);
  
  if(error){
    let errMsg = error.details.map((el)=>{el.message}).join(",");
    throw new ExpressError(400,errMsg);
  }else{
    next();
  }
  
}


//Review Post Route
router.post('/' ,validateReview,wrapAsync(async(req,res , next)=>{

  let turf = await Turf.findById(req.params.id);
  let newReview = new Review(req.body.review);

  turf.reviews.push(newReview);

  await newReview.save();
  await turf.save();
  req.flash("success" , "New Review Created!!");

  res.redirect(`/turfs/${turf._id}`);
  }))

//Review delete route

router.delete("/:reviewId" , wrapAsync(async(req , res)=>{
  let {id , reviewId} = req.params;
  await Turf.findByIdAndUpdate(id ,{$pull :{reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("error" , "Review Deleted!!");

  res.redirect(`/turfs/${id}`);

}))

module.exports = router;