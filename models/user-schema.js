const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const userSchema = new Schema({
    name: { type: String, required: true },
    email: { type: String, required: true , unique : true},
    password: { type: String , required: true},
    country : {type : Number, required : true},
    countryTwoLetterCode : {type : String },
    fcmToken : { type : String , default: 'dLlzacFRRAGIiE9lm7llyf:APA91bEODGAvxkjhn6GRdH2KhjOiobgETrpW0WeJ4R2WI4m4wW_SJ6G2_TJGoIlhv9sG38lsAtCpCq1TJHXG9PLFWhx0NCdgxwpA4AMXGZ7v8D_ArQV-v3FNzKpkfbw4x-XZha83YPbQ' },
    phoneNumber : { type : Number, required : true},
    nationality : { type : String},
    country : { type : String},
    dob : { type : String },
    nickname : { type : String},
    gender: { type : String},
    authToken :{ type : String},
    resetToken:{ type:String },
    expireToken:{ type:Date },
    ip:{ type:String },
    browser:{ type:String },
    status : { type :String , default :'active'},
    inventory: [{ type: mongoose.Types.ObjectId,  ref: 'Product'}],
    plans: [{ type: mongoose.Types.ObjectId,  ref: 'Plans'}],
    payments: [{ type: mongoose.Types.ObjectId,  ref: 'Payment'}],
    notifications : [{ type : mongoose.Types.ObjectId , ref : 'Notification'}],
    isSubscribed : { type: Boolean, default: false },
    isFreePlan :  { type: Boolean, default: false },
    isVerified : { type: Boolean, default: false },
    Balance : {type :Number , default : "1"},
    planexpireToken:{ type:Date },
    otpHex: { type: String },
    userType : { type : String, default : "Customer"}
   
}, { versionKey: false });

userSchema.plugin(uniqueValidator)


module.exports = mongoose.model('User', userSchema);