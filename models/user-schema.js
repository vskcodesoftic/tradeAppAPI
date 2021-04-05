const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique : true},
    password: { type: String , required: true},
    countryCode : {type : Number, required : true},
    phoneNumber : { type : Number, required : true},
    resetToken:{ type:String },
    expireToken:{ type:Date },
    otpHex: { type: String },
    ip: { type: String, required: true },
    browser: { type: String, required: true },
    inventory: [{ type: mongoose.Types.ObjectId, ref: 'Product'}]

}, { versionKey: false });

userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('User', userSchema);