const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildID: String,
    dateJoined: Date,
});
module.exports = mongoose.model('Guild', guildSchema, 'guilds');