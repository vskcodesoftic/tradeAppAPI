  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const notificationSchema = new Schema({
    title: { type: String },
    message: { type: String },
    senderName :{ type: String},
    userproductId : { type : String},
    userEmail : { type : String },
     productOfferedNationality: { type : String},
     productOfferedCountry : { type : String},
     productOfferedNickname : { type : String},
     productsOffered : [Schema.Types.Mixed],
     productOfferedEmail : { type : String},
    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Notification', notificationSchema);