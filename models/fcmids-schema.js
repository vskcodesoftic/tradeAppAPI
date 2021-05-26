  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const fcmidsSchema = new Schema({
    name: { type: String },
    fcmToken : { type : String},
    email : { type : String }
});

module.exports = mongoose.model('FcmID', fcmidsSchema);