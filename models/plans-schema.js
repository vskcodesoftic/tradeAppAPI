  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plansSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    amount : { type : Number },
    validity : {type : Number , required : true},
    type : { type :String },
    visbility : { type :Boolean , default : true},
    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Plans', plansSchema);