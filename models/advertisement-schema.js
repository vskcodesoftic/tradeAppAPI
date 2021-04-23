  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const advertisementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image : { type :String },
    isFeatured : {type : Boolean },
    isShow : {type : Boolean, default : false },

   });

module.exports = mongoose.model('Advertisement', advertisementSchema);