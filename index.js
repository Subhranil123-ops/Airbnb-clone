const express = require("express");
const mongoose = require("mongoose");
const Air = require("./model/air.js");
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
let port = 3000;
const app = express();
const path = require("path");
const methodOverride = require("method-override");
const ejsMate=require("ejs-mate");
const multer =require("multer");
const upload = multer();
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs",ejsMate);
// READ ROUTE
app.get("/listing", async (req, res) => {
    let showLists = await Air.find({});
    console.log(showLists);
    res.render("listings.ejs", { showLists });
});
// NEW ROUTE
app.get("/listing/new", (req, res) => {
    res.render("update.ejs");
});
// CREATE ROUTE
app.post("/listing", async (req, res) => {
    let listing = new Air(req.body.listing);
    console.log(listing);
    await listing.save();
    res.redirect("/listing");
});
// SHOW ROUTE
app.get("/listing/:id", async (req, res) => {
    let { id } = req.params;
    let showEach = await Air.findById(id);
    console.log(showEach);
    res.render("inlisting.ejs", { showEach });
});
// EDIT ROUTE
app.get("/listing/:id/edit", async (req, res) => {
    let { id } = req.params;
    let showEach = await Air.findById(id);
    res.render("edit.ejs", { showEach });
});
// PATCH ROUTE
app.patch("/listing/:id", async (req, res) => {
    let { id } = req.params;
    await Air.findByIdAndUpdate(id, req.body, { new: true });
    res.redirect("/listing");
});
// DELETE ROUTE
app.delete("/listing/:id/delete", async (req, res) => {
    let { id } = req.params;
    await Air.findByIdAndDelete(id);
    res.redirect("/listing");
});

app.listen(port, () => {
    console.log("app is listenting on the port", port);
});
