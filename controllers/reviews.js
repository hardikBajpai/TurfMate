const Turf = require('../models/turfs');
const Review = require('../models/review');


module.exports.postReview = async(req,res , next)=>{

  let turf = await Turf.findById(req.params.id);

  let newReview = new Review(req.body.review);
  newReview.author = req.user._id;

  turf.reviews.push(newReview);

  await newReview.save();
  await turf.save();
  req.flash("success" , "New Review Created!!");

  res.redirect(`/turfs/${turf._id}`);
};

module.exports.destroyReview = async(req , res)=>{
  let {id , reviewId} = req.params;
  await Turf.findByIdAndUpdate(id ,{$pull :{reviews : reviewId}});
  await Review.findByIdAndDelete(reviewId);
  req.flash("error" , "Review Deleted!!");

  res.redirect(`/turfs/${id}`);

};

