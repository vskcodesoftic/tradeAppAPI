var url = require('url');


const mongoose = require('mongoose');
const { validationResult } = require('express-validator')
const  User = require('../models/user-schema')
const  Plan = require('../models/plans-schema');
const  Payment = require('../models/payments-schema');
const HttpError = require('../middleware/http-error');
const axios = require('axios')
const { v1: uuid } = require('uuid')


//get list of payments
const getPaymentsList = async (req ,res ,next) => {
  let payments
  try{
      payments = await Payment.find()
  }
  catch(err){
      const error = new HttpError("can not fetch payments complete request",500)
      return next(error)
  }
  res.json({ payments : payments.map( payments => payments.toObject({ getters : true}))})
  
}

// post payment 
const createPayment = async (req, res, next) => {
  const  { CstFName, CstEmail, CstMobile, ProductTitle } = req.body;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
   //const creator = req.userData.userId;

    const creator =  "606ab49296e7700f29b6ac5e";

    //temproy for testing after in prodction protect route and pass userId to creator  
      
    let user;
    try {
        user = await User.findById(creator);
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
    
       const OrderId = uuid()
        axios.post('https://api.upayments.com/test-payment', {
        merchant_id: process.env.MERCHNAT_ID,
        username: process.env.USERNAME,
        password : process.env.PASSWORD,
        api_key: process.env.API_KEY,
        order_id: OrderId,
        total_price:'90',
        CurrencyCode:'USD',
      //  success_url:process.env.SUCCESS_URL,
        error_url: process.env.ERROR_URL,
        test_mode:'',
        CstFName : "siva",
        CstEmail : "testing@gmail.com",
        success_url :"http://localhost:8001/api/payment/successUrl"

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
            creator 
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
  
// post create basic payment  based on type of plan
const createBasicPayment = async (req, res, next) => {
  const  { CstFName, CstEmail, CstMobile, ProductTitle  } = req.body;
    
      const planType = req.params.pid;
      const creator = req.params.cid;

    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    console.log(creator)
    //const creator = creator

   //const creator = req.userData.userId;

    //const creator =  "606ab49296e7700f29b6ac5e";

    //temproy for testing after in prodction protect route and pass userId to creator  
      
    let user;
    try {
        user = await User.findById(creator);
      }
         catch (err) {
      const error = new HttpError('server side error , please try again', 500);
      console.log("error ")
      return next(error);
    }
  
    if (!user) {
      const error = new HttpError('Could not find user for provided id', 404);
      return next(error);
    }
    

    const CreatorEmail = user.email;
    const CreatorName = user.name;

    const dateHumanReadable = new Date();
    
    const dateFullYear = dateHumanReadable.getFullYear();
    const dateFullMonth =dateHumanReadable.getMonth();
    const dateFullDay = dateHumanReadable.getDay();

    const FullDATE = `${dateFullDay}/${dateFullMonth}/${dateFullYear}`

  console.log(planType)

     //IdentifyingPrice of plan
     let identifyPrice;
     try{
         
     identifyPrice  = await Plan.findOne({ type : planType }).exec();

     }
     catch(err){
      const error = new HttpError('identifying price failed', 500);
      console.log("error ")
      return next(error);
    }  

     let identifiedPrice;
    
    identifiedPrice =  identifyPrice.amount;

           console.log("identified price " + identifiedPrice)

         //IdentifyingNo of posts of plan
         let identifyNumPosts;
         try{
             
         identifyNumPosts  = await Plan.findOne({ type : planType }).exec();
    
         }
         catch(err){
          const error = new HttpError('identifying no of posts failed', 500);
          console.log("error ")
          return next(error);
        }  
    
         let identifiedNumOfPosts;
        
        identifiedNumOfPosts =  identifyNumPosts.posts;
       
        const postId = identifiedNumOfPosts;
        const cId = creator;
        
    console.log("identified posts count "+ identifiedNumOfPosts)

       const OrderId = uuid()
        axios.post('https://api.upayments.com/test-payment', {
        merchant_id: process.env.MERCHNAT_ID,
        username: process.env.USERNAME,
        password : process.env.PASSWORD,
        api_key: process.env.API_KEY,
        order_id: OrderId,
        total_price: identifiedPrice,  
        CurrencyCode:'USD',
      //  success_url:process.env.SUCCESS_URL,
        error_url: `https://badilnyint.com/api/payment/errorUrl`,
        test_mode:'',
        CstFName : "test",
        CstEmail : "testing@gmail.com",
        success_url :`https://badilnyint.com/api/payment/successUrl/:${postId}/creator/:${cId}`

      })
      .then(async (response) =>{
          console.log(response)
          const createdPlan = new Payment({
            order_id : OrderId,
            total_price : identifiedPrice,
            CstFName :CreatorName,
            CstEmail:CreatorEmail,
            CstMobile,
            ProductTitle,
            planType,
            creator 
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
  



//successurl
const successUrl = async (req, res, next) => {

  const postsBalance = req.params.postId;
  let creatorId = req.params.cId;
  

 var url_parts = url.parse(req.url, true);
var query = url_parts.query;
let orderID = query.OrderID;
let paymentId = query.PaymentID;
let result = query.Result;
let postDate = query.PostDate;
let tranId = query.TranID;
let ref = query.Ref;
let trackId = query.TrackID;

     //  updating details based on order id saving payment and transaction id
     let user;
     try {
       user = await Payment.findOneAndUpdate({ order_id : orderID},{ new : false} );
     } catch (err) {
       const error = new HttpError(
         'Something went wrong, could not update payment details. orderid saved for reference',
         500
       );
       return next(error);
     }
   
     user.Result =  result;
     user.TrackingId = trackId;
     user.TranId = tranId;
     user.Ref = ref;
     user.PostDate = postDate;
     user.PaymentID = paymentId;


     try {
      await user.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, couldnt update details of payment, but payment recived done ',
        500
      );
      return next(error);
    }
     
 ///done till fetching

   //extracting cstreator id and ommitting :  by slicing 
  let cString = creatorId.slice(1);
    console.log("creator id"+cString)
   /// checkingcreatorId
   let creatorFound;
   try {
       creatorFound = await User.findById(`${cString}`)
     }
        catch (err) {
     const error = new HttpError('creator checking  failed, please try again', 500);
     console.log(err)
     return next(error);
   }
 
   if(!creatorFound){
    const error = new HttpError('not found plan', 404);
    return next(error);
   }
   
    console.log("found creator id"+creatorId)

   // updating balance of user based on plan postId
   let balanceString = postsBalance.slice(1);

 
   try {
    await User.findByIdAndUpdate({ _id : cString }, { $inc: { Balance: balanceString }});
   } catch (err) {
     console.log(err)
     const error = new HttpError(
       'Something went wrong, could not update Balance.',
       500
     );
     return next(error);
   }

   res.redirect('/success.html');
  //res.json({ message : "payment successfull"})

}




//errorUrl
const errorUrl = async (req , res,next) => {
  var url_parts = url.parse(req.url, true);
  var query = url_parts.query;
  let orderID = query.OrderID;
  let paymentId = query.PaymentID;
  let result = query.Result;
  let postDate = query.PostDate;
  let tranId = query.TranID;
  let ref = query.Ref;
  let trackId = query.TrackID;

   //  updating details based on order id saving payment and transaction id
   let user;
   try {
     user = await Payment.findOneAndUpdate({ order_id : orderID},{new : false});
   } catch (err) {
     const error = new HttpError(
       'Something went wrong, could not update payment details. orderid saved for reference',
       500
     );
     return next(error);
   }
 
   user.Result =  result;
   user.TrackingId = trackId;
   user.TranId = tranId;
   user.Ref = ref;
   user.PostDate = postDate;
   user.PaymentID = paymentId;


   try {
    await user.save();
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, couldnt update details of payment, but payment failed done ',
      500
    );
    return next(error);
  }
  res.redirect('/failed.html');

}


//free plan

//successurl
const FreePayment = async (req, res, next) => {


  const planType = req.params.pid;
   const creator = req.userData.userId;

const errors = validationResult(req);
if (!errors.isEmpty()) {

  return next(
    new HttpError('Invalid inputs passed, please check your data.', 422)
  );
}
console.log(creator)
//const creator = creator

//const creator = req.userData.userId;

//const creator =  "606ab49296e7700f29b6ac5e";

//temproy for testing after in prodction protect route and pass userId to creator  
  
let user;
try {
    user = await User.findById(creator);
  }
     catch (err) {
  const error = new HttpError('server side error , please try again', 500);
  console.log("error ")
  return next(error);
}

if (!user) {
  const error = new HttpError('Could not find user for provided id', 404);
  return next(error);
}



console.log(planType)

 //IdentifyingPrice of plan
 let identifyPrice;
 try{
     
 identifyPrice  = await Plan.findOne({ type : planType }).exec();

 }
 catch(err){
  const error = new HttpError('identifying price failed', 500);
  console.log("error ")
  return next(error);
}  

 let identifiedPrice;

identifiedPrice =  identifyPrice.amount;

       console.log("identified price " + identifiedPrice)

     //IdentifyingNo of posts of plan
     let identifyNumPosts;
     try{
         
     identifyNumPosts  = await Plan.findOne({ type : planType }).exec();

     }
     catch(err){
      const error = new HttpError('identifying no of posts failed', 500);
      console.log("error ")
      return next(error);
    }  

     let identifiedNumOfPosts;
    
    identifiedNumOfPosts =  identifyNumPosts.posts;
   
    const postId = identifiedNumOfPosts;
    const cId = creator;
    
console.log("identified posts count "+ identifiedNumOfPosts)  

  

 
   try {
    await User.findByIdAndUpdate({ _id : creator }, { $inc: { Balance: identifiedNumOfPosts }});
   } catch (err) {
     console.log(err)
     const error = new HttpError(
       'Something went wrong, could not update Balance.',
       500
     );
     return next(error);
   }

   //res.redirect('/success.html');
  res.json({ message : "Free Plan Activated"})

}


  exports.createPayment = createPayment;
  exports.successUrl = successUrl;
  exports.errorUrl = errorUrl;

  exports.createBasicPayment = createBasicPayment;
  exports.getPaymentsList = getPaymentsList;
  exports.FreePayment = FreePayment;
