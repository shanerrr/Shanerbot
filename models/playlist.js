const mongoose = require("mongoose");
const songSchema = require("./song")
const playlistSchema = mongoose.Schema({
    name: String,
    public: Boolean,
    image:String,
    songs:[songSchema]
}, {timestamps: true}
);
module.exports = playlistSchema;