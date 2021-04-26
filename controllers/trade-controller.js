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



  const userIds = await user.email
  console.log(userIds)



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

    const message = `"your message : ${productTitle}, ${productDescription}"`
    console.log(message)

  //sendingNotification
  const createdNotification = new Notification({
    message,
    creator: creatorIdofUser,
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
  }



   
  res.json({ ProposedProductIds: await offeredProductId.pids, LoggedUserEmail: loggedUser.email });
};

exports.sendTradeRequest = sendTradeRequest;
