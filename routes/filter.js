const express = require("express");
const router = express.Router();
const Air = require("../model/air.js");
const wrapAsync = require("../utils/wrapAsync.js");
router.get("/", async (req, res, next) => {
    let { q } = req.query;
    let listings = await Air.find({ category: q });
    if(listings.length){
     return res.render("./search/search.ejs", { listings });
    }else{
        res.render("./search/noresult.ejs");
    }
});
module.exports = router;