const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedin, isAuthor, validateReview } = require("../middleware.js");
const reviewController = require("../controllers/reviews.js");

//POST REVIEWS
router.post(
    "/",
    isLoggedin,
    validateReview,
    wrapAsync(reviewController.addReview));

// DELETE REVIEWS
router.delete(
    "/:reviewId",
    isLoggedin,
    isAuthor,
    wrapAsync(reviewController.destroyReview))

module.exports = router;