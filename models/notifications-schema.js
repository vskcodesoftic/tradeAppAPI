  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const notificationSchema = new Schema({
    title: { type: String },
    message:  [Schema.Types.Mixed],
    senderName :{ type: String},
    productID : { type : String},
    userEmail : { type : String },
     productOfferedNationality: { type : String},
     productOfferedCountry : { type : String},
     nickname : { type : String},
     productsOffered : [Schema.Types.Mixed],
     productOfferedEmail : { type : String},
     userFcmToken : { type : String},
     selectedUserFcmToken : { type : String},
     flag : { type : String},
     type: { type : String},
     senderId: { type : String},
     isRead : { type : Boolean, default : 'false'},




    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Notification', notificationSchema);