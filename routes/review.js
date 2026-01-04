const express = require("express");
const router=express.Router({mergeParams:true});
const Air=require("../model/air.js")
const Review=require("../model/review.js");
const ExpressError = require("../utils/ExpressError");
const wrapAsync=require("../utils/wrapAsync.js");
const {reviewSchema } = require("../schema.js");
const validateReview = async (req, res, next) => {
    let data = reviewSchema.validate(req.body);
    console.log(data);
    if (data.error) {
        return next(new ExpressError(400, data.error));
    } else {
        next();
    }
}

// REVIEWS
//POST REVIEWS
router.post("/", validateReview, wrapAsync(async (req, res, next) => {
    let { listingId } = req.params;
    let listing = await Air.findById(listingId);
    const newReview = new Review(req.body.review);
    await newReview.save();
    listing.reviews.push(newReview);
    let data = await listing.save();
    req.flash("success","New Review is added");
    res.redirect(`/listing/${listingId}`);
}));

// DELETE REVIEWS
router.delete("/:reviewId", wrapAsync(async (req, res, next) => {
    let { listingId, reviewId } = req.params;
    console.log(reviewId);
    await Air.findByIdAndUpdate(listingId, {
        $pull: { reviews: reviewId }
    })
    await Review.findByIdAndDelete(reviewId);
    req.flash("success","Review deleted");
    res.redirect(`/listing/${listingId}`);
}
))
module.exports=router;