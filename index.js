// requiring express
const express = require("express");
const app = express();
// requiring mongoose
const mongoose = require("mongoose");

// requiring models
// const Air = require("./model/air.js");
// const Review = require("./model/review.js");

// requiring routes
const listings=require("./routes/listing");
const reviews=require("./routes/review");

// mongoose connection
async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/wanderlust');
}
main()
    .then(() => {
        console.log("connected to db");
    })
    .catch((err) => {
        console.log(err);
    });

const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
app.engine("ejs", ejsMate);
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));

// USING ROUTES
app.use("/listing",listings);
app.use("/listing/:listingId/reviews",reviews);

// RUNS WHEN ROUTE IS WRONG
// app.use((req, res, next) => {
//     return next(new ExpressError(404, "Page not found"));
// });

// ERROR NAME
app.use((err, req, res, next) => {
    console.log(err.name);
    next(err);
});

// ERROR HANDLER
app.use((err, req, res, next) => {
    console.log(err.stack);
    let { status = 500, message = "Something went wrong" } = err;
    res.status(status).render("error.ejs", { message });
});

app.listen(3000, () => {
    console.log("app is listenting on the port : 3000");
});

// const wrapAsync = require("./utils/wrapAsync");
// const ExpressError = require("./utils/ExpressError");
// const { listingSchema, reviewSchema } = require("./schema.js");


// const validateSchema = (req, res, next) => {
//     const result = listingSchema.validate(req.body);
//     if (result.error) {
//         return next(new ExpressError(400, result.error));
//     } else {
//         next();
//     }
// };
// const validateReview = async (req, res, next) => {
//     let data = reviewSchema.validate(req.body);
//     console.log(data);
//     if (data.error) {
//         return next(new ExpressError(400, data.error));
//     } else {
//         next();
//     }
// }
// // READ ROUTE
// app.get("/listing", wrapAsync(async (req, res, next) => {
//     let showLists = await Air.find({});
//     res.render("listings.ejs", { showLists });
// }));

// // NEW ROUTE
// app.get("/listing/new", wrapAsync((req, res, next) => {
//     res.render("update.ejs");
// }));

// // CREATE ROUTE
// app.post("/listing", validateSchema, wrapAsync(async (req, res, next) => {

//     let newListing = new Air(req.body.listing);
//     await newListing.save();
//     res.redirect("/listing");

// }));

// // SHOW ROUTE
// app.get("/listing/:id", wrapAsync(async (req, res, next) => {
//     let { id } = req.params;
//     let showEach = await Air.findById(id).populate("reviews");
//     res.render("inlisting.ejs", { showEach });
// }));

// // EDIT ROUTE
// app.get("/listing/:id/edit", wrapAsync(async (req, res, next) => {
//     let { id } = req.params;
//     let showEach = await Air.findById(id);

//     res.render("edit.ejs", { showEach });
// }));

// // PATCH ROUTE
// app.patch("/listing/:id", validateSchema, wrapAsync(async (req, res, next) => {
//     let { id } = req.params;
//     if (!req.body.listing) {
//         return next(new ExpressError(400, "Send Valid data"));
//     }
//     await Air.findByIdAndUpdate(id, req.body.listing, { new: true });
//     res.redirect(`/listing/${id}`);
// }));

// // DELETE ROUTE
// app.delete("/listing/:id/delete", wrapAsync(async (req, res, next) => {
//     let { id } = req.params;
//     let r = await Air.findByIdAndDelete(id);
//     console.log(r);
//     res.redirect("/listing");
// }));

// // REVIEWS
// //POST REVIEWS
// app.post("/listing/:id/reviews", validateReview, wrapAsync(async (req, res, next) => {
//     let { id } = req.params;
//     let listing = await Air.findById(id);
//     const newReview = new Review(req.body.review);
//     await newReview.save();
//     listing.reviews.push(newReview);
//     let data = await listing.save();
//     res.redirect(`/listing/${id}`);
// }));

// // DELETE REVIEWS
// app.delete("/listing/:id/reviews/:reviewId", wrapAsync(async (req, res, next) => {
//     let { id, reviewId } = req.params;
//     await Air.findByIdAndUpdate(id, {
//         $pull: { reviews: reviewId }
//     })
//     await Review.findByIdAndDelete(reviewId);
//     res.redirect(`/listing/${id}`);
// }
// ));


