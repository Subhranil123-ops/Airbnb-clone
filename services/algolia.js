const appId = process.env.ALGOLIA_APPLICATION_ID;
const key = process.env.ALGOLIA_API_KEY;
const algoliasearch = require("algoliasearch");
const client = algoliasearch(appId, key);
const index=client.initIndex("listing");
console.log(index);
const Air = require("../model/air.js");
const wrapAsync = require("../utils/wrapAsync.js");
module.exports.syncListingOnCreate = (wrapAsync(async (req, res, next) => {
    let listing = req.body.listing;
    const records = [
        { objectID: listing._id.toString(),
        title: listing.title,
         country: listing.country ,
         location: listing.location ,
         price: listing.price 
        }
    ];
    let response = await client.saveObjects({
        indexName: "listing",
        objects: records
    });
    console.log(response);
}));
