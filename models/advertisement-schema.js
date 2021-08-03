  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const advertisementSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    hyperLink :{ type: String  },
    image : { type :String },
    isFeatured : {type : Boolean },
    isShow : {type : Boolean, default : false },
    createdAt : { type: Date, default: Date.now}

   });

module.exports = mongoose.model('Advertisement', advertisementSchema);