const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique : true},
    password: { type: String , required: true},
    countryCode : {type : Number, required : true},
    phoneNumber : { type : Number, required : true},
    nationality : { type : String},
    country : { type : String},
    dob : { type : Date },
    nickname : { type : String},
    gender: { type : String},
    resetToken:{ type:String },
    expireToken:{ type:Date },
    ip:{ type:String },
    browser:{ type:String },
    inventory: [{ type: mongoose.Types.ObjectId,  ref: 'Product'}],
    plans: [{ type: mongoose.Types.ObjectId,  ref: 'Plans'}],
    payments: [{ type: mongoose.Types.ObjectId,  ref: 'Payment'}],
    notifications : [{ type : mongoose.Types.ObjectId , ref : 'Notification'}],
    isSubscribed : { type: Boolean, default: false },
    Balance : {type :Number , default : "0"},
    planexpireToken:{ type:Date },
    otpHex: { type: String }

   
}, { versionKey: false });

userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('User', userSchema);