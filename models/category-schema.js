  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    category: { type: String, required: true },
    subcategory : [{ type: String, required: true }],
},{ versionKey: false });

module.exports = mongoose.model('Category', categorySchema);