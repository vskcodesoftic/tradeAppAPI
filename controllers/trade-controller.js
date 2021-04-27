const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const User = require("../models/user-schema");
const Product = require("../models/product-schema");
const Notification = require('../models/notifications-schema')

const HttpError = require("../middleware/http-error");

const { v1: uuid } = require("uuid");

const sendTradeRequest = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "invalid input are passed,please pass valid data",
      422
    );
    return next(error);
  }

  let message 
  //user who has loggedin
  const loggedUser = req.userData;

  const {
    userproductId,
    offeredProductId,
    senderId,
    senderName,
    senderNationality,
    productsOffered,
  } = req.body;

  //let productIds = []
  let productIds = await {offeredProductId}
  


   //ProposedProductIdbyLoggedUser =  productIds.push(`${offeredProductId}`);;

   ProposedProductIdbyLoggedUser = await productIds;

  
   const productId = userproductId; //(objectidofproduct)
   //the userProduct to whom he wanna offer trade (single id of product from slider)


  // finding the productId of provided
  let product;
  try {
    product = await Product.findById(productId);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a product.",
      500
    );
    return next(error);
  }

  if (!product) {
    const error = new HttpError(
      "Could not find a product for the provided id.",
      404
    );
    return next(error);
  }

  const creatorIdofUser = product.creator;
//obtained creatorId from sliderProduct

  let user;
  try {
    user = await User.findById(creatorIdofUser);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a user.",
      500
    );
    return next(error);
  }

  if (!user) {
    const error = new HttpError(
      "Could not find a user for the provided id.",
      404
    );
    return next(error);
  }



  const PrdEmail = await user.email
  const PrdCountry = await user.country
  const PrdNationality = await user.nationality
  const PrdNickname = await user.nickname






  // offered Products 
  let offrdProducts  = await offeredProductId.pids

  for (const productOffrd in offrdProducts) {
   // console.log(`${prduct}: ${ds[prduct]}`);
    let products;
    try {
      products = await Product.findById(`${offrdProducts[productOffrd]}`);
    } catch (err) {
      const error = new HttpError(
        "Something went wrong, could not find a product.",
        500
      );
      return next(error);
    }
  
    if (!products) {
      const error = new HttpError(
        "Could not find a product for the provided id.",
        404
      );
      return next(error);
    }
    const productTitle = products.title;
    const productDescription = products.description;
    const productQuantity = products.quantity;

    console.log("title :" + productTitle +" ,"+"desc :" +productDescription +" ,"+"quantity  :" + productQuantity)

     message = `"your message : ${productTitle}, ${productDescription}"`
    console.log(message)


  
  }

  //sendingNotification
  const createdNotification = new Notification({
    message,
    creator: creatorIdofUser,
    productsOffered : [offrdProducts],
    userproductId ,
    productOfferedEmail  :  PrdEmail,
    productOfferedNationality :   PrdNationality,
    productOfferedCountry : PrdCountry,
    productOfferedNickname : PrdNickname,
    userEmail : loggedUser.email,
    country: PrdCountry,

  });

  try {
    const sess = await mongoose.startSession();
    sess.startTransaction();
    await createdNotification.save({ session: sess });
    user.notifications.push(createdNotification);
    await user.save({ session: sess });
    await sess.commitTransaction();
 



  } catch (err) {
      console.log(err)
    const error = new HttpError(
      'Creating notfication failed, please try again.',
      500
    );
    return next(error);
  }
   
  res.json({ ProposedProductIds: await offeredProductId.pids, LoggedUserEmail: loggedUser.email });
};







const acceptTrade = async (req, res ,next) => {
 
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    console.log(errors);
    const error = new HttpError(
      "invalid input are passed,please pass valid data",
      422
    );
    return next(error);
  }



 
 const  notificationID =  req.params.id; 
  //let productIds = []
  //let productIds = await {offeredProductId}
  

  // finding the productId of provided
  let notification;
  try {
    notification = await Notification.findById(notificationID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not find a notification.",
      500
    );
    return next(error);
  }

  if (!notification) {
    const error = new HttpError(
      "Could not find a notification for the provided id.",
      404
    );
    return next(error);
  }


   // offered Products 
   let offrdProducts  = await  notification.productsOffered;
     let ProductIds=[];
    for (const [key, value] of Object.entries(offrdProducts[0])) {
      ProductIds.push(`${value}`)
          
      //UPDATINGproduct

//updating status of products
let product;
try {
  product = await Product.findById(`${value}`);
} catch (err) {
  console.log(err)
  const error = new HttpError(
    'Something went wrong, could not found to  update product.',
    500
  );
  return next(error);
}

//setting product expiry 15days
product.isShow = "false";
product.expireToken = Date.now() + 1

try {
  await product.save();
} catch (err) {
  console.log(err)
  const error = new HttpError(
    'Something went wrong, could not update the product.',
    500
  );
  return next(error);
}

   

  
    }

 res.json({ Productids : ProductIds , message : "isShow status updates to false  and product expiry to 15days"})


}

exports.sendTradeRequest = sendTradeRequest;
exports.acceptTrade = acceptTrade;
