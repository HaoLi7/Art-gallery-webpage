const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    addedArtworks: {type:[Schema.Types.ObjectId], default:[]},
    followedArtists: {type:[Schema.Types.ObjectId], default:[]},
    likedArtworks: {type:[Schema.Types.ObjectId], default:[]},
    notifications: {type:[Schema.Types.ObjectId], default:[]}
});

module.exports = mongoose.model("User", userSchema);