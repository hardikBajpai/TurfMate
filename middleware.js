const Review = require("./models/review");

module.exports.isLoggedIn = (req , res , next)=>{
    if(!req.isAuthenticated()){
        res.locals.redirectUrl = req.session.redirectUrl;
        req.flash("error" , "You must be logged in First!!");
        return res.redirect(`/login`);
      }
      next();
}

module.exports.saveRedirectUrl = (req ,res , next)=>{
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}

module.exports.isReviewAuthor = async(req , res , next)=>{
    let {id , reviewId} = req.params;

    let review = await Review.findById(reviewId);

    if(!review.author.equals(res.locals.currUser._id)){
        req.flash("error" , "you did not created this review!!");
        return res.redirect(`/turfs/${id}`);
    }
    next();
}