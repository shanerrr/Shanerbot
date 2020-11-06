const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    userID: String,
    firstConversation: Date,
    playlists: {}
});
module.exports = mongoose.model('User', userSchema, 'Users');