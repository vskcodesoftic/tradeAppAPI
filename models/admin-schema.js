const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const adminSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique : true},
    password: { type: String , required: true},
    resetToken:{ type:String },
    expireToken:{ type:Date },
    ip:{ type:String },
    browser:{ type:String }
   
}, { versionKey: false });

adminSchema.plugin(uniqueValidator)


module.exports = mongoose.model('Admin', adminSchema);