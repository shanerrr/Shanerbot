const mongoose = require("mongoose");
const playlistSchema = require("./playlist")
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guild: String,
    username: String,
    userID: String,
    playlists: [playlistSchema]
}, { timestamps: true });
module.exports = mongoose.model('User', userSchema, 'Users');