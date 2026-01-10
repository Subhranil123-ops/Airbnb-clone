const appId = process.env.ALGOLIA_APPLICATION_ID;
const key = process.env.ALGOLIA_WRITE_API_KEY;
const { algoliasearch } = require("algoliasearch");
const client = algoliasearch(appId, key);
const wrapAsync = require("../utils/wrapAsync.js");
module.exports.syncListingOnDelete = (wrapAsync(async (req, res, next) => {
    let { listingId } = req.params;
    let response = await client.deleteObject({
        indexName: "listing",
        objectID: listingId
    });
    // await client.waitForTask({
    //     indexName: "listings",
    //     taskID: response.taskID
    // });
    next();
}));
