const express = require("express");
const router = express.Router({mergeParams:true});
const wrapAsync = require('../utils/wrapAsync');
const ExpressError = require('../utils/ExpressError');
const {isLoggedIn, saveRedirectUrl, isReviewAuthor} = require("../middleware.js");
const {reviewSchema} = require("../schema.js");

const reviewController = require("../controllers/reviews.js");
const review = require("../models/review.js");

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
router.post('/', saveRedirectUrl,isLoggedIn, validateReview ,wrapAsync(reviewController.postReview));


//Review delete route
router.delete("/:reviewId" ,isLoggedIn,isReviewAuthor,  wrapAsync(reviewController.destroyReview));

module.exports = router;