const Air = require("./model/air.js");
const Review = require("./model/review.js");
const { listingSchema, reviewSchema, signSchema } = require("./schema.js");
const ExpressError = require("./utils/ExpressError");

// for login
module.exports.isLoggedin = ((req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.redirectUrl = req.originalUrl;
        req.flash("failure", "You must be logged in to make any changes !");
        res.redirect("/users/login");
    } else next();
});

// Redirect user to the original URL after authentication
module.exports.saveRedirect = ((req, res, next) => {
    if (req.session.redirectUrl) {
        res.locals.redirect = req.session.redirectUrl;
        console.log(res.locals.redirect);
    }
    next();
});

// Authorization middleware: restricts edit and 
// delete access to the listing owner
module.exports.isOwner = (async (req, res, next) => {
    let { listingId } = req.params;
    let listing = await Air.findById(listingId);
    if (req.user && listing.owner.equals(req.user._id)) {
        return next();
    } else {
        req.flash("failure", "This listing doesn't belongs to you .");
        return res.redirect(`/listing/${listingId}`);
    }
}
);
module.exports.isAuthor = (async (req, res, next) => {
    const { reviewId, listingId } = req.params;
    let review = await Review.findById(reviewId);
    if (review.author.equals(req.user._id)) {
        return next();
    } else {
        req.flash("failure", "Only the author of this review can delete it.");
        return res.redirect(`/listing/${listingId}`);
    }
})

// Joi schema validations for listing
module.exports.validateSchema = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        return next(new ExpressError(400, result.error));
    } else {
        next();
    }
};

// joi vallidation for reviews
module.exports.validateReview = async (req, res, next) => {
    let data=reviewSchema.validate(req.body);
    if (data.error) {
        return next(new ExpressError(400, data.error));
    } else {
        next();
    }
}

// joi validation for users
module.exports.validateUser = ((req, res, next) => {
    const result = signSchema.validate(req.body);
    if (result.error) {
        return next(new ExpressError(400, result.error));
    } else next();
})