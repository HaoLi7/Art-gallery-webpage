const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const workshopSchema = new mongoose.Schema({
    host:String,
    topic:{type:String,default:"Workshop"},
    date:{type:String,default:"2022-12-1"},
    location:{type:String,default:"TBD"}
});

module.exports = mongoose.model("Workshop", workshopSchema);