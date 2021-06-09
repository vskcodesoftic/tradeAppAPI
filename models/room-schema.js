  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;


const roomSchema = new Schema({
    socketId:[{type: String }],
    roomId:{type : String },
    msg: [{type: String, }],
    partcipants :[{type: String }],
    createdAt : { type: Date, default: Date.now},
    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}

   });

module.exports = mongoose.model('Room', roomSchema);