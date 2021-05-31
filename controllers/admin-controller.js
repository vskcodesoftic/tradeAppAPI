
const mongoose = require('mongoose');


const { validationResult } = require('express-validator')

const  User = require('../models/user-schema')
const  Product = require('../models/product-schema')
const Banner = require('../models/banner-schema');
const Advertisement = require('../models/advertisement-schema');
const Payment = require('../models/payments-schema');
const  Plan = require('../models/plans-schema');
const Category = require('../models/category-schema');
const FcmIds = require('../models/fcmids-schema');
const Notification = require('../models/notifications-schema')

const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')

const FCM = require('fcm-node')


const serverKey = require('../firebase/config/firebasecred.json') //put the generated private key path here    
    
const fcm = new FCM(serverKey)

//get list of users
const getUsersList = async(req, res, next) => {

let users
try{
    users = await User.find()
}
catch(err){
    const error = new HttpError("can not fetch users complete request",500)
    return next(error)
}
res.json({ users : users.map( user => user.toObject({ getters : true})) })

}

//get users count
const getUsersCount = async (req ,res ,next) => {


  let users
try{
    users = await User.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch users complete request",500)
    return next(error)
}
res.json({ users : users})


}

//no of products
const getProductsCount = async (req ,res ,next) => {


  let products
try{
    products = await Product.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch products complete request",500)
    return next(error)
}
res.json({ products : products})


}

//no of feautured products
const getFeauturedProductsCount = async (req ,res ,next) => {


  let products
try{
    products = await Product.find({isFeatured : true }).countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch products complete request",500)
    return next(error)
}
res.json({ products : products})


}

//no of Payments
const getPaymentsCount = async (req ,res ,next) => {


  let payments
try{
    payments = await Payment.find().countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch payments complete request",500)
    return next(error)
}
res.json({ payments : payments})


}


//postBannerImages
const postBannerImages = async (req ,res , next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, image, isFeatured, isShow } = req.body;

  const createdBanner = new Banner({
    title,
    description,
    image : req.file.path ,
    isFeatured,
    isShow,
  });


  try {
    await createdBanner.save()
  }
catch(err){
  console.log(err)
  const error = new HttpError(
    'Creating product failed, please try again.',
    500
  );
  return next(error);
}
res.json({ Banner : createdBanner })
}

//get bannerImgs
const getBannerImages = async (req, res ,next) => {
  let BannerImages
  try{
      BannerImages = await Banner.find().sort({_id:1}).limit(5);
  }
  catch(err){
      const error = new HttpError("can't fetch banner images ",500)
      return next(error)
  }
  res.json({ bannerImages : BannerImages.map( Banner => Banner.toObject({ getters : true}))})
}


//postAdvertisementImages
const postAdvertisementImages = async (req ,res , next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { title, description, image, isFeatured, isShow } = req.body;

  const createdAdvertisementImage = new Advertisement({
    title,
    description,
    image : req.file.path ,
    isFeatured,
    isShow,
  });


  try {
    await createdAdvertisementImage.save()
  }
catch(err){
  console.log(err)
  const error = new HttpError(
    ' uploading failed, please try again.',
    500
  );
  return next(error);
}
res.json({ Advertisement : createdAdvertisementImage })
}

//get bannerImgs
const getAdvertisementImages = async (req, res ,next) => {
  let addImages
  try{
      addImages = await Advertisement.find().sort({_id:1}).limit(5);
  }
  catch(err){
      const error = new HttpError("can't fetch addvertisement images ",500)
      return next(error)
  }
  res.json({ advertisementImages : addImages.map( Imgs => Imgs.toObject({ getters : true}))})
}

//post add category 
const addCategory = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {

    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }

  const { subcategory , category} = req.body;
  
  //const a= [{ cat :[ `${subcategory}`] }]
  //const fruits = await [`"${productIds}"`];
   //const category = await [`${subcategory}`]

  const createdCategory = new Category({
     category,
     subcategory
  });

 
  try {
      await createdCategory.save();
    } catch (err) {
      const error = new HttpError(
        'Creating Category failed, please try again.',
        500
      );
      console.log(err)
      return next(error);
    }


  res.status(201).json({ category: createdCategory });
}



//get list of category 
const getCategories = async (req, res, next) => {
  let category
  try{
    category = await Category.find()
  }
  catch(err){
      const error = new HttpError("can't fetch plans complete request",500)
      return next(error)
  }
  res.json({ categories : category.map( category => category.toObject({ getters : false}))})
  
}




//get list of plans 
const getPlansList = async (req, res, next) => {
    let plans
    try{
        plans = await Plan.find()
    }
    catch(err){
        const error = new HttpError("can't fetch plans complete request",500)
        return next(error)
    }
    res.json({ plans : plans.map( plans => plans.toObject({ getters : true}))})
    
  }
  
  
  

// post plan 
const createPlan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description, amount,type, posts } = req.body;
  
 
  
    const createdPlan = new Plan({
      title,
      description,
      amount,
      posts,
      type
    });
  
   
    try {
        await createdPlan.save();
      } catch (err) {
        const error = new HttpError(
          'Creating Plan failed, please try again.',
          500
        );
        console.log(err)
        return next(error);
      }

  
    res.status(201).json({ plan: createdPlan });
  };
  

//update plan
const updatePlan = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description  , posts, amount , plantype} = req.body;
    
   //  const planId = req.params.pid;
    let plan;
    try {
      plan = await Plan.findOneAndUpdate({type : plantype});
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update plan.',
        500
      );
      return next(error);
    }
  
    plan.title = title;
    plan.description = description;
    plan.posts = posts;
    plan.amount = amount;
  
    try {
      await plan.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, couldnt update plan.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ plan: plan.toObject({ getters: true }) });
  };
  
//DELETE PLAN
  const deletePlan = async (req, res, next) => {
    const planId = req.params.pid;
    Plan.findByIdAndRemove(planId)
    .then((result) => {
      res.json({
        success: true,
        msg: `plan has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'there is no plan to delete with provided id.' });
    });

  };


  //update product
  const updateProductVisiblity = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
    const productId = req.params.pid;

    const { isShow } = req.body;
  
    let product;
    try {
      product = await Product.update(
        { productid : productId },
        {
          isShow 
        }
      );

    } catch (err) {
      console.log(err)
      const error = new HttpError(
        'Something went wrong, could not upda;te product.',
        500
      );
      return next(error);
    }
   
    product.isShow = isShow;
  
    try {
      await product.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update product.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ product: product.toObject({ getters: true }) });
  };
  
//update product by id
const updatePlanById = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(
      new HttpError('Invalid inputs passed, please check your data.', 422)
    );
  }
  const { title, description,visbility,amount, posts, type } = req.body;
  const planId = req.params.pid;

  let plan;
  try {
    plan = await Plan.findById(planId);
  } catch (err) {
    const error = new HttpError(
      'Something went wrong, could not found to  update plan.',
      500
    );
    return next(error);
  }

  plan.title = title;
  plan.description = description;
  plan.visbility = visbility;
  plan.amount = amount;
  plan.posts = posts;
  plan.type =type;



  try {
    await plan.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update the  plan.',
      500
    );
    return next(error);
  }

  res.status(200).json({ plan: plan.toObject({ getters: true }) });

};

 //send push notification
 const sendNotification = async(req , res, next) => {

  const  { msgToUser }  =  req.body;
  const sendMulticast = async(fcmTokens, message) => {

    var message = {
        registration_ids: fcmTokens,
        notification: {
            title: msgToUser,
            content: msgToUser,
        }
    };
    await fcm.send(message, function(err, response){
        if (err) {
          console.log(err)
          res.json({message : response})
        } else {
            res.json({message : response})
        }
      })
  }
  
  let fcmTokens
  try{
      fcmTokens = await FcmIds.find()
  }
  catch(err){
      const error = new HttpError("can not fetch fcms complete request",500)
      return next(error)
  }

  let fcmIds = [];

  let multifcmTokens= [] ;
    fcmIds   = await  fcmTokens.map( fcmTokens => fcmTokens.fcmToken );

    multifcmTokens  = fcmIds
  console.log(multifcmTokens)
 // let fc= ["cZWNDhsmTEOikbvWpwcj0H:APA91bHeg305Q-8L5JBKOMl6fByY8QVAaOoiCHkGElsDm2zKK_iZkh_RgPc0CoIjNBWmi4sCrzCJNDFVyeRnYz6DUTx_wNmSSb2AvjLE5D1-hidBT4s-B5DcLvQbHnFe1Yz2sKO_JWLE","yZWNDhsmTEOikbvWpwcj0H:APA91bHeg305Q-8L5JBKOMl6fByY8QnvnvVAaOoiCHkGElsDm2zKK_iZkh_RgPc0CoIjNBWmi4sCrzCJNDFVyeRnYz6DUTx_wNmSSb2AvjLE5D1-hidBT4s-B5DcLvQbHnFe1Yz2sKO_JWLE","c"]
var message = {
  to : `${multifcmTokens}` ,
  notification: {
  desc : msgToUser
  }

}


sendMulticast(multifcmTokens, message)
 }



 //product trade request
 const sendDualTradeNotification = async (req ,res ,next) => {

  const {
    userproductId,
    offeredProductId,
    senderId,
    senderName,
    senderNationality,
    productsOffered,
  } = req.body;



  //user logged data
  const LoggedUser = req.userData;
  const LoggedUserID = req.userData.userId;

  console.log(LoggedUser.email)

  const LoggedUserFcmToken = LoggedUser.fcmToken;

  let user;
  try {
      user = await User.findById(LoggedUserID);
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
  
 const LoggedUserName = user.name;
 const LoggedUserCountry = user.country;

 //


  
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

const SelectedUserId = product.creator;
const SelectedProductTitle = product.title;






//obtained creatorId from sliderProduct

let SelectedUser;
try {
  SelectedUser = await User.findById(SelectedUserId);
} catch (err) {
  const error = new HttpError(
    "Something went wrong, could not find a user.",
    500
  );
  return next(error);
}

if (!SelectedUser) {
  const error = new HttpError(
    "Could not find a user for the provided id.",
    404
  );
  return next(error);
}



const SelectedUserEmail = await SelectedUser.email
const SelectedUserCountry = await SelectedUser.country
const SelectedUserNationality = await SelectedUser.nationality
const SelectedUserNickname = await SelectedUser.nickname

const SelectedUserFcmToken = await SelectedUser.fcmToken

  let fcmToken = [];
   fcmToken.push(`${LoggedUserFcmToken}`);


  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: `${SelectedUserFcmToken}`,
    
    notification: {
        title: `hi , ${SelectedUserNickname} you have Recived Trade Request from ${LoggedUserName}` , 
        body: `Product requested for Trade :  ${SelectedProductTitle} Accept Trade Request to know more `
    },
    
};


let productIds = await {offeredProductId}
//ProposedProductIdbyLoggedUser =  productIds.push(`${offeredProductId}`);;
ProposedProductIdbyLoggedUser = await productIds;



fcm.send(message, function(err, response){
  if (err) {
      console.log("Something has gone wrong!",err);
  } else {
      
      console.log("Successfully sent with response: ", response);
  }
});


 // offered Products 
 let offrdProducts  = await offeredProductId.pids
  let msg = [];
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

   //console.log("title :" + productTitle +" ,"+"desc :" +productDescription +" ,"+"quantity   :" + productQuantity)

   let details = `"offered products are ${productTitle} ,desc : ${productDescription} ,quantity   : ${productQuantity}"`

    message = `"your message : ${productTitle}, ${productDescription}"`

    msg.push(details)

 }
 await console.log(msg)

 //sendingNotification
 const createdNotification = new Notification({
   message : [msg],
   creator: LoggedUserID,
   productsOffered : [offrdProducts],
   userproductId ,
   productOfferedEmail  :  LoggedUser.email,   //offer recived by email
   productOfferedNationality :   SelectedUserNationality,
   productOfferedCountry : SelectedUserCountry,
   productOfferedNickname : SelectedUserEmail,
   userEmail : LoggedUser.email,

 });

 try {
   const sess = await mongoose.startSession();
   sess.startTransaction();
   await createdNotification.save({ session: sess });
   SelectedUser.notifications.push(createdNotification);
   await SelectedUser.save({ session: sess });
   await sess.commitTransaction();




 } catch (err) {
     console.log(err)
   const error = new HttpError(
     'Creating notfication failed, please try again.',
     500
   );
   return next(error);
 }

 res.json({message : 'testing'})
}
  exports.createPlan =createPlan ;
  exports.getPlansList = getPlansList;
  exports.updatePlan = updatePlan;
  exports.deletePlan = deletePlan;
  exports.updateProductVisiblity = updateProductVisiblity;
  exports.postBannerImages = postBannerImages;
  exports.getBannerImages = getBannerImages;
  exports.postAdvertisementImages = postAdvertisementImages;
  exports.getAdvertisementImages = getAdvertisementImages;
  exports.addCategory = addCategory;
  exports.getCategories = getCategories;
  exports.getUsersList = getUsersList;
  exports.updatePlanById = updatePlanById;
  exports.sendNotification = sendNotification;
  exports.getUsersCount = getUsersCount;
  exports.getProductsCount = getProductsCount;
  exports.getFeauturedProductsCount = getFeauturedProductsCount;
  exports.getPaymentsCount = getPaymentsCount;
  exports.sendDualTradeNotification = sendDualTradeNotification;