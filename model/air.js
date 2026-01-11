const mongoose = require("mongoose");
const Review = require("./review");
const User = require("./user.js");
const {client}=require("../config/algolia.js");
const schema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    media: {
        image: {
            filename: {
                type: String
            },
            url: {
                type: String,
            }
        },
        model:{
            filename:String,
            url:{
                type:String
            }
        }
    },
    price: {
        type: Number
    },
    location: {
        type: String
    },
    country: {
        type: String
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Review"
    }],
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    geometry: {
        type: {
            type: String,
            enum: ['Point'],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    }
});
schema.pre("findOneAndDelete", () => console.log("PRE IS WORKING FOR DELITING A LISTING"));
schema.post("findOneAndDelete", async (listing) => {
    try {
        if (listing.reviews.length) {
            await Review.deleteMany({
                _id: { $in: listing.reviews }
            });
        }
    }
    catch (e) {
        console.log("error in post delete :", e);
    }
});
let syncAlgoliaData = async (listing) => {
    try {
        const records =
        {
            objectID: listing._id.toString(),
            title: listing.title,
            country: listing.country,
            location: listing.location,
            price: listing.price
        }
            ;
        let response = await client.saveObject({
            indexName: "listing",
            body: records
        });
        // await client.waitForTask({
        //     indexName: "listings",
        //     taskID: response.taskID
        // });
    }
    catch (e) {
        console.log("error in post : ", e);
    }
}
schema.pre("save", () => console.log("PRE WORKING FOR SAVING A NEW LISTING "));
schema.post("save", syncAlgoliaData);
schema.pre("findOneAndUpdate", () => console.log("PRE WORKING FOR SAVING AN UPDATED LISTING "));
schema.post("findOneAndUpdate", syncAlgoliaData);
const Air = mongoose.model("Air", schema);
module.exports = Air;