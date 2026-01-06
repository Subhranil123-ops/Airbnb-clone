const mongoose = require("mongoose");
const data = require("./data.js");
const Air = require("../model/air.js");
async function main() {
    await mongoose.connect("mongodb://127.0.0.1:27017/wanderlust");
}
main()
    .then(() => {
        console.log("connection established");
    })
    .catch((err) => {
        console.log(err);
    });
let insertData = async () => {
    await Air.deleteMany({});
    data.data=data.data.map(el=>({...el,owner:"695c02d7fd8bc7326570b2f0"}))
    await Air.insertMany(data.data);
    console.log("data was initialised")
};
insertData();
