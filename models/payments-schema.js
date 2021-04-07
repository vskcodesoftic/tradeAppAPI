  
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const paymentSchema = new Schema({
    order_id : { type :String },
    total_price : { type :String },
    CstFName : { type :String },
    CstEmail : { type :String },
    CstMobile : { type :String },
    ProductTitle : { type : String},




    creator: { type: mongoose.Types.ObjectId,  ref: 'User'}
});

module.exports = mongoose.model('Payment', paymentSchema);