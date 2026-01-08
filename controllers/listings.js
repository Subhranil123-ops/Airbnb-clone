
const Air = require("../model/air.js");

module.exports.allListings = async (req, res, next) => {
    let showLists = await Air.find({});
    res.render("listings.ejs", { showLists });
};

module.exports.renderCreateNewListingForm = (req, res, next) => {
    res.render("update.ejs");
}

module.exports.showListing = async (req, res, next) => {
    let { listingId } = req.params;
    let showEach = await Air.findById(listingId)
        .populate({
            path: "reviews",
            populate: {
                path: "author"
            }
        })
        .populate("owner")
    if (!showEach) {
        req.flash("failure", "listing is unavailable");
        return res.redirect("/listing");
    }
    res.render("inlisting.ejs", { showEach,mapToken:process.env.MAPBOX_TOKEN });
}

module.exports.createNewListing = async (req, res, next) => {
    let newListing = new Air(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = req.geometry;
    console.log("express : ", req.geometry);
    await newListing.save();
    req.flash("success", "New listing is added");
    res.redirect("/listing");
}

module.exports.renderEditForm = async (req, res, next) => {
    let { listingId } = req.params;
    let showEach = await Air.findById(listingId)
    if (!showEach) {
        req.flash("failure", "listing is unavailable");
        return res.redirect("/listing");
    }
    res.render("edit.ejs", { showEach });
}

module.exports.editListing = async (req, res, next) => {
    let { listingId } = req.params;
    let showEach = await Air.findById(listingId)
    if (showEach.owner.equals(req.user._id)) {
        req.body.listing.geometry = req.geometry;
        await Air.findByIdAndUpdate(listingId, req.body.listing, { new: true });
        req.flash("success", "listing updated");
        return res.redirect(`/listing/${listingId}`);
    }
}

module.exports.destroyListing = async (req, res, next) => {
    let { listingId } = req.params;
    await Air.findByIdAndDelete(listingId);
    req.flash("success", "Listing deleted successfully");
    return res.redirect("/listing");
}