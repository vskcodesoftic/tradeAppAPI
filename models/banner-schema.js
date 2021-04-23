  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const bannerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image : { type :String },
    isFeatured : {type : Boolean },
    isShow : {type : Boolean, default : false },
    createdAt : { type: Date, default: Date.now},

   });

module.exports = mongoose.model('Banner', bannerSchema);