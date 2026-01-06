const express = require("express");
const router = express.Router();
const Air = require("../model/air.js");
const ExpressError = require("../utils/ExpressError");
const wrapAsync = require("../utils/wrapAsync");

// Joi schema validations
const { listingSchema } = require("../schema.js");
const validateSchema = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        return next(new ExpressError(400, result.error));
    } else {
        next();
    }
};

// middlewares
const { isLoggedin } = require("../middleware.js");



// READ ROUTE
router.get("/",
    wrapAsync(async (req, res, next) => {
        let showLists = await Air.find({});
        res.render("listings.ejs", { showLists });
    }));

// NEW ROUTE
router.get("/new",
    isLoggedin,
    wrapAsync((req, res, next) => {
        res.render("update.ejs");
    }));

// CREATE ROUTE
router.post("/",
    validateSchema,
    wrapAsync(async (req, res, next) => {
        let newListing = new Air(req.body.listing);
        newListing.owner=req.user._id;
        await newListing.save();
        req.flash("success", "New listing is added");
        res.redirect("/listing");
    }));

// SHOW ROUTE
router.get("/:listingId",
    wrapAsync(async (req, res, next) => {
        let { listingId } = req.params;
        let showEach = await Air.findById(listingId)
            .populate("reviews")
            .populate("owner");
        if (!showEach) {
            req.flash("failure", "listing is unavailable");
            return res.redirect("/listing");
        }
        res.render("inlisting.ejs", { showEach });
    }));

// EDIT ROUTE
router.get("/:listingId/edit",
    isLoggedin,
    wrapAsync(async (req, res, next) => {
        let { listingId } = req.params;
        let showEach = await Air.findById(listingId);
        if (!showEach) {
            req.flash("failure", "listing is unavailable");
            return res.redirect("/listing");
        }
        res.render("edit.ejs", { showEach });
    }));

// PATCH ROUTE
router.patch("/:listingId",
    validateSchema,
    wrapAsync(async (req, res, next) => {
        let { listingId } = req.params;
        await Air.findByIdAndUpdate(listingId, req.body.listing, { new: true });
        req.flash("success", "listing updated");
        res.redirect(`/listing/${listingId}`);
    }));

// DELETE ROUTE
router.delete("/:listingId/delete",
    isLoggedin,
    wrapAsync(async (req, res, next) => {
        let { listingId } = req.params;
        let r = await Air.findByIdAndDelete(listingId);
        req.flash("success", "Listing deleted successfully");
        res.redirect("/listing");
    }));

module.exports = router;