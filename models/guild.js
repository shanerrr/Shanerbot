const mongoose = require("mongoose");

const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildID: String,
}, { timestamps: true });
module.exports = mongoose.model('Guild', guildSchema, 'guilds');