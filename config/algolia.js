const appId = process.env.ALGOLIA_APPLICATION_ID;
const key = process.env.ALGOLIA_WRITE_API_KEY;
const { algoliasearch } = require("algoliasearch");
const client = algoliasearch(appId, key);
module.exports={
    client
}