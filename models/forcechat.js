const mongoose = require("mongoose");
const fcSchema = mongoose.Schema({
    music: String,
    chat: String,
    both: false,
});
module.exports = fcSchema;