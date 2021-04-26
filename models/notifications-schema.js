  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const notificationSchema = new Schema({
    title: { type: String },
    message: { type: String },
    senderId : { type : String },
    senderName :{ type: String},
    senderNationality: { type : String},
    // productsOffered : [{ type : String}],
    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Notification', notificationSchema);