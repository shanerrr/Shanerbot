const mongoose = require("mongoose");
const playlistSchema = require("./playlist")
const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    firstConversation: Date,
    playlists: [playlistSchema]

});
module.exports = mongoose.model('User', userSchema, 'Users');