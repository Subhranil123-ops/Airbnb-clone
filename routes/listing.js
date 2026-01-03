const express = require("express");
const router=express.Router();
const Air=require("../model/air.js");
const ExpressError = require("../utils/ExpressError");
const wrapAsync=require("../utils/wrapAsync");
const { listingSchema} = require("../schema.js");
const validateSchema = (req, res, next) => {
    const result = listingSchema.validate(req.body);
    if (result.error) {
        return next(new ExpressError(400, result.error));
    } else {
        next();
    }
};

// READ ROUTE
router.get("/", wrapAsync(async (req, res, next) => {
    let showLists = await Air.find({});
    res.render("listings.ejs", { showLists });
}));

// NEW ROUTE
router.get("/new", wrapAsync((req, res, next) => {
    res.render("update.ejs");
}));

// CREATE ROUTE
router.post("/", validateSchema, wrapAsync(async (req, res, next) => {

    let newListing = new Air(req.body.listing);
    await newListing.save();
    res.redirect("/listing");

}));

// SHOW ROUTE
router.get("/:listingId", wrapAsync(async (req, res, next) => {
    let { listingId } = req.params;
    let showEach = await Air.findById(listingId).populate("reviews");
    res.render("inlisting.ejs", { showEach });
}));

// EDIT ROUTE
router.get("/:listingId/edit", wrapAsync(async (req, res, next) => {
    let { listingId } = req.params;
    let showEach=await Air.findById(listingId);
    res.render("edit.ejs", { showEach });
}));

// PATCH ROUTE
router.patch("/:listingId", validateSchema, wrapAsync(async (req, res, next) => {
    let { listingId } = req.params;
    await Air.findByIdAndUpdate(listingId, req.body.listing, { new: true });
    res.redirect(`/listing/${listingId}`);
}));

// DELETE ROUTE
router.delete("/:listingId/delete", wrapAsync(async (req, res, next) => {
    let { listingId } = req.params;
    let r = await Air.findByIdAndDelete(listingId);
    console.log(r);
    res.redirect("/listing");
}));

module.exports=router;