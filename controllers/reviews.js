const Turf = require("../models/turfs");
const Review = require("../models/review");

module.exports.postReview = async (req, res) => {

    const turf = await Turf.findById(req.params.id);

    if (!turf) {
        req.flash("error", "Turf not found");
        return res.redirect("/turfs");
    }

    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;

    turf.reviews.push(newReview);

    await newReview.save();
    await turf.save();

    req.flash("success", "New review created!");

    res.redirect(`/turfs/${turf._id}`);
};

module.exports.destroyReview = async (req, res) => {

    const { id, reviewId } = req.params;

    await Turf.findByIdAndUpdate(id, {
        $pull: { reviews: reviewId }
    });

    await Review.findByIdAndDelete(reviewId);

    req.flash("success", "Review deleted successfully!");

    res.redirect(`/turfs/${id}`);
};