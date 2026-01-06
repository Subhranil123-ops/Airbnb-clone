const express = require("express");
const router = express.Router();
const User = require("../model/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedin, isOwner, validateSchema } = require("../middleware.js");
const listingController = require("../controllers/listings.js");

router
    .route("/")
    .get(wrapAsync(listingController.allListings))
    .post(
        isLoggedin,
        validateSchema,
        wrapAsync(listingController.createNewListing)
    )
    
router.get(
    "/new",
    isLoggedin,
    wrapAsync(listingController.renderCreateNewListingForm)
);
router
    .route("/:listingId")
    .get(wrapAsync(listingController.showListing))
    .patch(isLoggedin,
        isOwner,
        validateSchema,
        wrapAsync(listingController.editListing)
    )
    .delete(
        isLoggedin,
        isOwner,
        wrapAsync(listingController.destroyListing)
    );

// EDIT ROUTE
router.get(
    "/:listingId/edit",
    isLoggedin,
    isOwner,
    wrapAsync(listingController.renderEditForm)
);

module.exports = router;