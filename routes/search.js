const Air = require("../model/air.js");
const appId = process.env.ALGOLIA_APPLICATION_ID;
const keySearch = process.env.ALGOLIA_SEARCH_API_KEY;
const { algoliasearch } = require("algoliasearch");
const client = algoliasearch(appId, keySearch);
const wrapAsync = require("../utils/wrapAsync.js");
const express = require("express");
const router = express.Router();
router.get("/", async (req, res) => {
    let { q } = req.query;
    let response = await client.searchSingleIndex({
        indexName: "listing",
        searchParams: {
            query: q
        }
    });
    let listings = []
    let { hits } = response;
    for (let hit of hits) {
        let listing = await Air.findOne({ _id: hit.objectID });
        console.log(listing);
        listings.push(listing);
    }
    res.render("./search/search.ejs", { listings });
});
module.exports = router;