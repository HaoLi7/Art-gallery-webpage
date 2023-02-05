const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const artistSchema = new mongoose.Schema({
    name: String,
    artworks:{type:[{artworkName:String,id:Schema.Types.ObjectId}], default:[]},
    workshops:{type:[Schema.Types.ObjectId],default:[]}
});

module.exports = mongoose.model("Artist", artistSchema);