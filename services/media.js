const media = require("../config/cloudinary.js");
const multer = require("multer");
const upload = multer({ storage: multer.memoryStorage() });
let fields = [{
    name: "image",
    maxCount: 1
}, {
    name: "model",
    maxCount: 1
}];
module.exports.uploadFileMulter = upload.fields(fields);


