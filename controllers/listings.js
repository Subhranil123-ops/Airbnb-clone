const Air = require("../model/air.js");
const cloudinary = require('cloudinary').v2;

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
    res.render("inlisting.ejs", { showEach, mapToken: process.env.MAPBOX_TOKEN });
}

module.exports.createNewListing = async (req, res, next) => {
    // cloudinary(this would be done only after authorization only so no worries)
    let bufferImage = req.files.image[0].buffer;
    let bufferModel = req.files.model?.[0].buffer;
    const uploadResultImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, uploadResult) => {
            if (error) return reject(error);
            return resolve(uploadResult);
        })
            .end(bufferImage);
    });
    cloudinary.uploader.upload_stream({ resource_type: "raw" }, (error, uploadResult) => {
        if (error) {
            return reject(error);
        }
        return resolve(uploadResult);
    }).end(bufferModel);
    let imageUrl = uploadResultImage.secure_url;
let modelUrl = uploadResultModel.secure_url;
let newListing = new Air(req.body.listing);
newListing.owner = req.user._id;
newListing.geometry = req.geometry;
newListing.media.image.url = imageUrl;
newListing.media.model.url = modelUrl;
await newListing.save();
req.flash("success", "New listing is added");
res.redirect("/listing");
};



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
    // cloudinary(this would be done only after authorization only so no worries)
    let bufferImage = req.files.image[0].buffer;
    let bufferModel = req.files.model?.[0].buffer;
    const uploadResultImage = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream((error, uploadResult) => {
            if (error) return reject(error);
            return resolve(uploadResult);
        })
            .end(bufferImage);
    });
    const uploadResultModel = await new Promise((resolve, reject) => {
        cloudinary.uploader.upload_stream({ resource_type: "raw" }, (error, uploadResult) => {
            if (error) {
                return reject(error);
            }
            return resolve(uploadResult);
        }).end(bufferModel);
    });
    let imageUrl = uploadResultImage.secure_url;
    let modelUrl = uploadResultModel.secure_url;
    //------------------------------------------------------
    let showEach = await Air.findById(listingId);
    if (showEach.owner.equals(req.user._id)) {
        req.body.listing.geometry = req.geometry;
        await Air.findByIdAndUpdate(listingId, {
            $set: {
                ...req.body.listing,
                "media.image.url": imageUrl
            }
        }, { new: true });
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