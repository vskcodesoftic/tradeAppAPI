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
    ip:{ type:String },
    browser:{ type:String },
    inventory: [{ type: mongoose.Types.ObjectId,  ref: 'Product'}]

}, { versionKey: false });

userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('User', userSchema);