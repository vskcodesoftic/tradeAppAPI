  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const bannerSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    image : { type :String },
    isFeatured : {type : Boolean },
    isShow : {type : Boolean, default : false },

   

    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Banner', bannerSchema);