  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const roomSchema = new Schema({
    socketId:[{type: String, required: true }],
    roomId:{type : String },
    msg: [{type: String, required: true }],
    partcipants :[{type: String }],
    createdAt : { type: Date, default: Date.now},
    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}

   });

module.exports = mongoose.model('Room', roomSchema);