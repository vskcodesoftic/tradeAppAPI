  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const productSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image : { type :String },
    modelNumber : { type : String },
    category : {type : String , required : true},
    made : { type : String},
    year : { type : String},
    productid :{ type: String},
   

    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Product', productSchema);