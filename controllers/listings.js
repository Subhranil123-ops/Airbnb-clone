const Air = require("../model/air.js");
const cloudinary = require('cloudinary').v2;

module.exports.allListings = async (req, res, next) => {
    let showLists = await Air.find({});
    let categories=[];
    for(let list of showLists){
        categories.push(list.category);
    };
    categories=categories.filter((value,index)=>{
        return categories.indexOf(value)===index;
    });
    
    res.render("listings.ejs", { showLists,categories });
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
    let newListing = new Air(req.body.listing);
    newListing.owner = req.user._id;
    newListing.geometry = req.geometry;
    newListing.category=req.body.listing.category;
    if (req.files?.image?.length) {
        let image = req.files.image[0];
        let { buffer } = image;
        const uploadResultImage = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream((error, uploadResult) => {
                if (error) return reject(error);
                return resolve(uploadResult);
            })
                .end(buffer);
        });
        let imageUrl = uploadResultImage.secure_url;
        newListing.media.image.url = imageUrl;
        newListing.media.image.filename = "image";
    }
    if (req.files?.model?.length) {
        let model = req.files.model[0];
        let { buffer } = model;
        const uploadResultModel = await new Promise((resolve, reject) => {
            cloudinary.uploader.upload_stream({ resource_type: "raw", folder: "models" }, (error, uploadResult) => {
                if (error) {
                    return reject(error);
                }
                return resolve(uploadResult);
            }).end(buffer);
        });
        let modelUrl = uploadResultModel.secure_url;
        newListing.media.model.url = modelUrl;
        newListing.media.model.filename = "model";
    }
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
    let showEach = await Air.findById(listingId);
    if (showEach.owner.equals(req.user._id)) {
        req.body.listing.geometry = req.geometry;
        await Air.findByIdAndUpdate(listingId, req.body.listing, { new: true });
        if (req.files?.image?.length) {
            let image = req.files.image[0];
            let { buffer } = image;
            const uploadResultImage = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream((error, uploadResult) => {
                    if (error) return reject(error);
                    return resolve(uploadResult);
                })
                    .end(buffer);
            });
            let imageUrl = uploadResultImage.secure_url;
            showEach.media.image.url = imageUrl;
            showEach.media.image.filename = "image";
            await showEach.save();
        }
        if (req.files?.model?.length) {
            let model = req.files.model[0];
            let { buffer } = model;
            const uploadResultModel = await new Promise((resolve, reject) => {
                cloudinary.uploader.upload_stream({ resource_type: "raw", folder: "models" }, (error, uploadResult) => {
                    if (error) {
                        return reject(error);
                    }
                    return resolve(uploadResult);
                }).end(buffer);
            });
            let modelUrl = uploadResultModel.secure_url;
            showEach.media.model.url = modelUrl;
            showEach.media.model.filename = "model";
            await showEach.save();
        }
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