  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imgOptOne : [{ type :String }],
    image : { type :String },
    category : {type : String , required : true},
    recommendCategory: {type : String , required : true},
    recommendSubcategory : [{type : String , required : true}],
    quantity : { type : Number },
    subcategory : { type : String },
    productid :{ type: String},
    categoryId :{ type: String},
    isFeatured : {type : Boolean },
    isShow : {type : Boolean, default : true },
    status : { type : String  ,default:'inactive'},
    resetToken:{ type:String },
    expireToken:{ type:Date },
    nickname: {type :String},
    country : {type :String},
    countryTwoLetterCode : { type : String},

   

    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Product', productSchema);