const mongoose = require("mongoose");
const fcSchema = require("./forcechat")
const guildSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    guildName: String,
    guildID: String,
    fc:[fcSchema],
}, { timestamps: true });
module.exports = mongoose.model('Guild', guildSchema, 'guilds');