const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator')
const Schema = mongoose.Schema;


const contactUsSchema = new Schema({
    Name: { type: String, required: true },
    Email: { type: String, required: true },
    Message: { type: String , required: true},
    Subject :{ type:String },
    Number:{ type:Number ,required: true  },
   
}, { versionKey: false });


module.exports = mongoose.model('Contact', contactUsSchema);