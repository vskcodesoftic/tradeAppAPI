  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image : { type :String },
    category : {type : String , required : true},
    subcategory : { type : String },
    productid :{ type: String},
    isFeatured : {type : Boolean },
    isShow : {type : Boolean, default : false },
   

    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Product', productSchema);