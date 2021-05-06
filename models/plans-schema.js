  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const plansSchema = new Schema({
    title: { type: String  },
    description: { type: String },
    amount : { type : Number },
    posts : {type : Number },
    type : { type :String },
    visbility : { type :Boolean , default : true},
    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Plans', plansSchema);