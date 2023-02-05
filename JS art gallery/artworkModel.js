const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artworkSchema = new mongoose.Schema({
    name: String,
    artist: String,
    year: String,
    category: String,
    medium: String,
    description: String,
    image: String,
    likeNum: {type: Number, default:0}
});

module.exports = mongoose.model("Artwork", artworkSchema);