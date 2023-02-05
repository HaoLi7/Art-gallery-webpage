const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new mongoose.Schema({
    from:String,
    fromId:Schema.Types.ObjectId,
    content:{type:[String],default:["No notifications"]}
});

module.exports = mongoose.model("Notification", notificationSchema);