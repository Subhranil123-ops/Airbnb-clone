const express = require("express");
const router = express.Router();
const User = require("../model/review");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");
const { isLoggedin, isOwner, validateSchema, validateLocation } = require("../middleware.js");
const listingController = require("../controllers/listings.js");
const { syncListingOnDelete } = require("../services/algolia.js");
const { uploadFileMulter } = require("../services/media.js");
router
    .route("/")
    .get(wrapAsync(listingController.allListings))
    .post(
        isLoggedin,
        uploadFileMulter,
        validateSchema,
        validateLocation,
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
        uploadFileMulter,
        validateSchema,
        validateLocation,
        wrapAsync(listingController.editListing)
    )
    .delete(
        isLoggedin,
        isOwner,
        syncListingOnDelete,
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