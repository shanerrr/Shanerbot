const mongoose = require("mongoose");
const songSchema = mongoose.Schema({
    name: String,
    duration: String,
    uri: String
}, {timestamps: true}
);
module.exports = songSchema;