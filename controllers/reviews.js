const Air = require("../model/air.js")
const Review = require("../model/review.js");

module.exports.addReview = async (req, res, next) => {
    let { listingId } = req.params;
    let listing = await Air.findById(listingId);
    const newReview = new Review(req.body.review);
    newReview.author = req.user._id;
    await newReview.save();
    listing.reviews.push(newReview);
    await listing.save();
    req.flash("success", "New Review is added");
    res.redirect(`/listing/${listingId}`);
}

module.exports.destroyReview = async (req, res, next) => {
    let { listingId, reviewId } = req.params;
    await Air.findByIdAndUpdate(listingId, {
        $pull: { reviews: reviewId }
    })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success", "Review deleted");
    res.redirect(`/listing/${listingId}`);
}