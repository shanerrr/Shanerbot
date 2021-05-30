const mongoose = require("mongoose");
const fcSchema = require("./Forcechat")
const guildSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  guildName: String,
  guildID: String,
  fc: [fcSchema],
  prefix: String
}, { timestamps: true });
module.exports = mongoose.model('Guild', guildSchema, 'guilds');