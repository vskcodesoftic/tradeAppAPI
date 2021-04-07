

const mongoose = require('mongoose');
const { validationResult } = require('express-validator')
const  User = require('../models/user-schema')
const  Plan = require('../models/plans-schema');
const  Payment = require('../models/payments-schema');
const HttpError = require('../middleware/http-error');
const axios = require('axios')
const { v1: uuid } = require('uuid')


// post payment 
const createPayment = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
 
    //temproy for testing after in prodction protect route and pass userId to creator  
      
    let user;
    try {
        user = await User.findById("606ab49296e7700f29b6ac5e");
      }
         catch (err) {
      const error = new HttpError('Creating product failedl, please try again', 500);
      console.log("error ")
      return next(error);
    }
  
    if (!user) {
      const error = new HttpError('Could not find user for provided id', 404);
      return next(error);
    }
       const  { CstFName, CstEmail, CstMobile, ProductTitle } = req.body;
       const OrderId = uuid()
        axios.post('https://api.upayments.com/test-payment', {
        merchant_id: process.env.MERCHNAT_ID,
        username: process.env.USERNAME,
        password : process.env.PASSWORD,
        api_key: process.env.API_KEY,
        order_id: OrderId,
        total_price:'90',
        CurrencyCode:'USD',
        success_url:process.env.SUCCESS_URL,
        error_url: process.env.ERROR_URL,
        test_mode:'',
        CstFName : "siva",
        CstEmail : "testing@gmail.com",

      })
      .then(async (response) =>{
          console.log(response)
          const createdPlan = new Payment({
            order_id : OrderId,
            total_price : '90',
            CstFName ,
            CstEmail,
            CstMobile,
            ProductTitle,
            creator:'606ab49296e7700f29b6ac5e' 
          })

      const url = response.data.paymentURL
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdPlan.save({ session: sess });
      user.payments.push(createdPlan);
      await user.save({ session: sess });
      await sess.commitTransaction();
      
      res.redirect(url);

    })

      .catch(function (error) {
        console.log(error);
      });
    
  
   
  };
  
  exports.createPayment = createPayment;