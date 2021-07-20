const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const { v1: uuid } = require('uuid')



const { validationResult } = require("express-validator");

const User = require("../models/user-schema");
const Room = require("../models/room-schema");

const Product = require("../models/product-schema");
const Notification = require('../models/notifications-schema')
const FcmIds = require('../models/fcmids-schema');

const FCM = require('fcm-node')
const serverKey = require('../firebase/config/firebasecred.json') //put the generated private key path here      
const fcm = new FCM(serverKey)
const HttpError = require("../middleware/http-error");
const { Console } = require("console");


// const sendTradeRequest = async (req, res, next) => {
//   const errors = validationResult(req);
//   if (!errors.isEmpty()) {
//     console.log(errors);
//     const error = new HttpError(
//       "invalid input are passed,please pass valid data",
//       422
//     );
//     return next(error);
//   }

//   let message 
//   //user who has loggedin
//   const loggedUser = req.userData;
//   const fcmTokenOfLoggedUser = req.userData.fcmToken;
 
//    console.log(fcmTokenOfLoggedUser)
   
//   const {
//     userproductId,
//     offeredProductId,
//     senderId,
//     senderName,
//     senderNationality,
//     productsOffered,
//   } = req.body;

//   //let productIds = []
//   let productIds = await {offeredProductId}
  


//    //ProposedProductIdbyLoggedUser =  productIds.push(`${offeredProductId}`);;

//    ProposedProductIdbyLoggedUser = await productIds;

  
//    const productId = userproductId; //(objectidofproduct)
//    //the userProduct to whom he wanna offer trade (single id of product from slider)


//   // finding the productId of provided
//   let product;

//   try {
//     product = await Product.findById(productId);
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not find a product.",
//       500
//     );
//     return next(error);
//   }

//   if (!product) {
//     const error = new HttpError(
//       "Could not find a product for the provided id.",
//       404
//     );
//     return next(error);
//   }

//   const creatorIdofUser = product.creator;

// //obtained creatorId from sliderProduct

//   let user;
//   try {
//     user = await User.findById(creatorIdofUser);
//   } catch (err) {
//     const error = new HttpError(
//       "Something went wrong, could not find a user.",
//       500
//     );
//     return next(error);
//   }

//   if (!user) {
//     const error = new HttpError(
//       "Could not find a user for the provided id.",
//       404
//     );
//     return next(error);
//   }



//   const PrdEmail = await user.email
//   const PrdCountry = await user.country
//   const PrdNationality = await user.nationality
//   const PrdNickname = await user.nickname

//   const FcmTokenofBuser = await user.fcmToken;


//    console.log("buser" +FcmTokenofBuser);

//   // offered Products 
//   let offrdProducts  = await offeredProductId.pids

//   for (const productOffrd in offrdProducts) {
//    // console.log(`${prduct}: ${ds[prduct]}`);
//     let products;
//     try {
//       products = await Product.findById(`${offrdProducts[productOffrd]}`);
//     } catch (err) {
//       const error = new HttpError(
//         "Something went wrong, could not find a product.",
//         500
//       );
//       return next(error);
//     }
  
//     if (!products) {
//       const error = new HttpError(
//         "Could not find a product for the provided id.",
//         404
//       );
//       return next(error);
//     }
//     const productTitle = products.title;
//     const productDescription = products.description;
//     const productQuantity = products.quantity;

//     console.log("title :" + productTitle +" ,"+"desc :" +productDescription +" ,"+"quantity   :" + productQuantity)

//      message = `"your message : ${productTitle}, ${productDescription}"`
//     console.log(message)


  
//   }

//   //sendingNotification
//   const createdNotification = new Notification({
//     message,
//     creator: creatorIdofUser,
//     productsOffered : [offrdProducts],
//     userproductId ,
//     productOfferedEmail  :  PrdEmail,
//     productOfferedNationality :   PrdNationality,
//     productOfferedCountry : PrdCountry,
//     productOfferedNickname : PrdNickname,
//     userEmail : loggedUser.email,
//     country: PrdCountry,

//   });

//   try {
//     const sess = await mongoose.startSession();
//     sess.startTransaction();
//     await createdNotification.save({ session: sess });
//     user.notifications.push(createdNotification);
//     await user.save({ session: sess });
//     await sess.commitTransaction();
 



//   } catch (err) {
//       console.log(err)
//     const error = new HttpError(
//       'Creating notfication failed, please try again.',
//       500
//     );
//     return next(error);
//   }
   
//   res.json({  LoggedUserEmail: loggedUser.email , createdNotification : createdNotification });
// };







const acceptTrade = async (req, res ,next) => {
 
 
  //user logged data
  const LoggedUser = req.userData;
  const LoggedUserID = req.userData.userId;

  console.log(LoggedUser.email)

  const LoggedUserFcmToken = LoggedUser.fcmToken;

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
  
  let senderId;
  let singleSenderId;
  // finding the productId of provided
  let notification;
  try {
    notification = await Notification.findById(notificationID);
  } catch (err) {
    const error = new HttpError(
      "Something went wrong, could not , ,find a notification.",
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

  const RoomNotificationId = notification.roomId;
  console.log(RoomNotificationId)

  //changinging isRead to true , type : accepted

  notification.isRead = true;
  notification.type = 'accepted';

  

 try {
      await notification.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update the  notification.',
        500
      );
      return next(error);
    }

    const notificationType = notification.type;
    const notificationIsRead = notification.isRead;



   // user single Products
      const userProduct  = await  notification.productID;
   // offered Products 
   let offrdProducts  = await  notification.productsOffered;
     let ProductIds=[];
 
      
    await ProductIds.push(`${userProduct}`);

    //finding userby product id single product
    
    let userproduct;
    try {
        userproduct  = await Product.findById(userProduct);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a product.',
        500
      );
      return next(error);
    }
  
    if (!userproduct) {
      const error = new HttpError(
        'Could not find a product for the provided id.',
        404
      );
      return next(error);
    }
  
   //setting product expiry 15days
userproduct.isShow = "false";
userproduct.isFeatured="false";
userproduct.status="notConfirmed";
userproduct.expireToken = Date.now() + 1297000000


 singleSenderId = userproduct.creator ;
    try {
      await userproduct.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update the  product.',
        500
      );
      return next(error);
    }




  //second stage updating status of offrered products
  try{

    for (const [key, value] of Object.entries(offrdProducts[0])) {
      ProductIds.push(`${value}`)

   
      
//updating status of offered products
let product;
try {
  product = await Product.findById(`${value}`);
} catch (err) {
  console.log(err)
  const error = new HttpError(
    'Something went wrong, could not found to  update notification.',
    500
  );
  return next(error);
}


//setting product expiry 15days
product.isShow = "false";
product.isFeatured="false";
product.status="notConfirmed";
product.expireToken = Date.now() + 1297000000

 senderId= product.creator;

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

  }
  catch (err) {
    const error = new HttpError(
      'Something went wrong. in updating offered products status',
      500
    );
    return next(error);
  }

    //finding user by SENDERID of user who is offering products
       
    let user;
    try {
        user  = await User.findById(senderId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a USER.',
        500
      );
      return next(error);
    }
  
    if (!user) {
      const error = new HttpError(
        'Could not find a user for the provided id.',
        404
      );
      return next(error);
    }
  
    const UserNickname = user.nickname;
    const UserFcmToken = user.fcmToken;
    const UserCountryCode = user.countryTwoLetterCode;
    console.log(senderId)


  //finding user who recived request

    let userWhoRecivedRequest;
    try {
      userWhoRecivedRequest  = await User.findById(singleSenderId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a USER.',
        500
      );
      return next(error);
    }
  
    if (!userWhoRecivedRequest) {
      const error = new HttpError(
        'Could not find a user for the provided id.',
        404
      );
      return next(error);
    }
  
    const senderUserNickname = userWhoRecivedRequest.nickname;
    

   let msg =[]
   let details = `hi , ${UserNickname} your Trade Request has been accepted ,You can now Intiate the Chat with ${senderUserNickname}, to know more"`

  // message = `"your message : ${productTitle}, ${productDescription}"`

   msg.push(details)


  var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: `${UserFcmToken}`,
    
    notification: {
        title: `hi , ${UserNickname} your Trade Request has been accepted ` , 
        body: `You can now Intiate the Chat with ${senderUserNickname}, to know more `
    },
    
};




fcm.send(message, function(err, response){
  if (err) {
      console.log("Something has gone wrong!",err);
  } else {
      
      console.log("Successfully sent with response: ", response);
  }
});


    

//creating notfication

 const createdNotification = new Notification({
  message : msg,
  creator: LoggedUserID,
  type : 'tradeResponse',
  nickname : UserNickname,
  flag :UserCountryCode,
  roomId :RoomNotificationId
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



 res.json({ Productids : ProductIds , message : `hi , ${UserNickname} your Trade Request has been accepted` , type :notificationType , isRead : notificationIsRead})


}

 //send push notification to all users
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
    productID,   // productID
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
 const LoggedUserCountryCode = user.countryTwoLetterCode;
 const LoggedUserNickname = user.nickname;
 const LoggedUserNation = user.nationality

 //


  
 const productId = productID; //(objectidofproduct)
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
const SelectedUserCountryCode = await SelectedUser.countryTwoLetterCode

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
 let offrdProducts  = await offeredProductId
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


//uuid

let NewRoomUuId = uuid()

 //sendingNotification
 const createdNotification = new Notification({
   message : [msg],
   creator: LoggedUserID,
   productsOffered : [offrdProducts],
   productID ,
   type : 'tradeRequest',
   productOfferedEmail  :  LoggedUser.email,   //offer recived by email
   nickname : LoggedUserNickname,
   userFcmToken : LoggedUserFcmToken,
   selectedUserFcmToken : SelectedUserFcmToken,
   senderId: LoggedUserID,
   flag :LoggedUserCountryCode,
   roomId : NewRoomUuId
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


//create room
const createdRoom = new Room({
  roomId : NewRoomUuId
});

try {
  await createdRoom.save();
} catch (err) {
  const error = new HttpError(
    'Creating Room failed, please try again.',
    500
  );
  console.log(err)
  return next(error);
}

 res.json({message : 'trade request sent ', Traderequest : createdNotification })
}

//confirm trade request
const confirmTradeRequest = async (req, res ,next) => {
  //userid of logged in user
  const userId = req.userData.userId;
   
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

  notification.isRead ="true";
  notification.type ="Confirmed";

  try {
    await notification.save();
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      'Something went wrong, could not update the notification isRead and type.',
      500
    );
    return next(error);
  }

   // user single Products
   const userProduct  = await  notification.productID;
   // offered Products 
   let offrdProducts  = await  notification.productsOffered;
     let ProductIds=[];
 
      
    await ProductIds.push(`${userProduct}`);

    //finding userby product id
    
    let userproduct;
    try {
        userproduct  = await Product.findById(userProduct);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a product.',
        500
      );
      return next(error);
    }
  
    if (!userproduct) {
      const error = new HttpError(
        'Could not find a product for the provided id.',
        404
      );
      return next(error);
    }
  
   //setting product expiry to null
    userproduct.isShow = "false";
    userproduct.isFeatured="false";
    userproduct.status="Confirmed";
    userproduct.expireToken = null
      
    try {
      await userproduct.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update the  product.',
        500
      );
      return next(error);
    }

     
    

     //second
      
    for (const [key, value] of Object.entries(offrdProducts[0])) {
      ProductIds.push(`${value}`)

   
            
      //updating status of offered products
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
      product.isFeatured="false";
      product.status="Confirmed";
      product.expireToken = null

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

  res.json({ message : " trade confirmed sucessfully! " ,notification : notification})

 }
 

 // Reject Trade Request 
 const rejectTradeRequest = async (req, res ,next) => {

   //userid of logged in user
   const userId = req.userData.userId;
   
   const  notificationID =  req.params.id; 
   //let productIds = []
   //let productIds = await {offeredProductId}
   
   let ProductOffredName ;
   let ProductOffredCountry ;
   let ProductOffredCountryCode ;
   let ProductOffredNickname ;
   let ProductOffredNation;
   let productTitle;
   let ProducOffredFcmToken;
   let productCreator;

   let user;


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
 
   
   notification.isRead ="true";
   notification.type ="Declined";

   const FoundRoomID = notification.roomId;
 
   try {
     await notification.save();
   } catch (err) {
     console.log(err)
     const error = new HttpError(
       'Something went wrong, could not update the notification isRead and type.',
       500
     );
     return next(error);
   }
 

    // user single Products
    const userProduct  = await  notification.productID;
    // offered Products 
    let offrdProducts  = await  notification.productsOffered;
      let ProductIds=[];
  
       
     await ProductIds.push(`${userProduct}`);
 
     //finding userby product id
     
     let userproduct;
     try {
         userproduct  = await Product.findById(userProduct);
     } catch (err) {
       const error = new HttpError(
         'Something went wrong, could not find a product.',
         500
       );
       return next(error);
     }
   
     if (!userproduct) {
       const error = new HttpError(
         'Could not find a product for theff provided id.',
         404
       );
       return next(error);
     }
   
    
     userproduct.isShow = "true";
     userproduct.isFeatured="true";
     userproduct.status="active";
       
     try {
       await userproduct.save();
     } catch (err) {
       const error = new HttpError(
         'Something went wrong, could not update the  product.',
         500
       );
       return next(error);
       }
 
 
      //second
       
     for (const [key, value] of Object.entries(offrdProducts[0])) {
       ProductIds.push(`${value}`)
 
    
             
       //updating status of offered products
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
       product.isShow = "true";
       product.isFeatured="true";
       product.status="active";
       
        productTitle =product.title;
  
        productCreator =product.creator
       console.log("creator",productCreator)
       console.log("product title", productTitle)

        //productOfferedUser
        user;
       try {
           user = await User.findById(productCreator);
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
       
       ProductOffredName = user.name;
      const ProductOffredCountry = user.country;
      const ProductOffredCountryCode = user.countryTwoLetterCode;
      const ProductOffredNickname = user.nickname;
      const ProductOffredNation = user.nationality;
      ProducOffredFcmToken = user.fcmToken;
     

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

    
     let msg =[]
     let details = `"hi , ${ProductOffredName} your Trade Request has been Declined , for product ${productTitle}"`
  
    // message = `"your message : ${productTitle}, ${productDescription}"`
  
     msg.push(details)
  
  
    var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
      to: `${ProducOffredFcmToken}`,
      
      notification: {
          title: `hi , ${ProductOffredName} your Trade Request has been decliend ` , 
          body: `, for product ${productTitle}"`
      },
      
  };
  
  
  
  
  fcm.send(message, function(err, response){
    if (err) {
        console.log("Something has gone wrong!",err);
    } else {
        
        console.log("Successfully sent with response: ", response);
    }
  });
  
  
  
  
  
  
  //creating notfication
  
   const createdNotification = new Notification({
    message : msg,
    creator: productCreator,
    type : 'Declined',
    nickname : ProductOffredName,
    flag :ProductOffredCountryCode,
    roomId :FoundRoomID
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

   

   res.json({ message : 'trade request declined', type : notification.type , flag : notification.flag ,isRead : notification.isRead , roomId : notification.roomId })
 }


//send Message 
const sendMessageToUser = async(req, res, next) => {

  //user id from body
  const userId = req.userData.userId;

  //user logged data
  const LoggedUser = req.userData;
  const LoggedUserID = req.userData.userId;
  
   console.log(userId)
  const {
    RoomId,   // productID
    Participants,
    senderId,
    senderName,
    senderNationality,
    productsOffered,
    message
  } = req.body;

  
  let user;
  try {
      user = await User.findById(userId);
    }
       catch (err) {
    const error = new HttpError('sending  message failed auth not found, please try again', 500);
    console.log("error ")
    return next(error);
  }

  if (!user) {
    const error = new HttpError('Could not find user for provided id', 404);
    return next(error);
  }

  const userName = user.name;
  const userID = userId;

  const countryCode =user.countryTwoLetterCode;
  const Nickname = user.nickname;

    //save database if room id matches to on room model
    try {
      await Room.updateOne({ "roomId": RoomId }, {
         "$push":{
          msg: `${userName} : ${message}`,
          partcipants : `${userID}`,
          chats: [{
            userId: userID,
            message: message,
            countryTwoLetterCode :countryCode ,
            nickname :Nickname
          }]
      }
     })
    }
    catch (err) {
      const error = new HttpError('sending  message failed, please try again', 500);
      console.log(err)
      return next(error);
    }

    let latestMessage;
    try {
       latestMessage = await Room.findOne({  "roomId": RoomId }).populate({ path: 'chats.userId', select: '_id' });
    }
    catch (err) {
      const error = new HttpError('sending  message failed, please try again', 500);
      console.log(err)
      return next(error);
    }

    res.json( { user: user.name, text: message  })
     
    }

  //get  all the mesagges by user id

  const getAllMesageBasedOnRoomId = async (req ,res ,next) => {
    


    const {
      RoomId  // productID

    } = req.body;

    let latestMessage;

    try {
        latestMessage = await Room.find({"roomId": RoomId }).sort().populate({ path: 'chats.userId', select: '_id' });
    }

    catch (err) {
      const error = new HttpError('loading  message failed, please try again', 500);
      console.log(err)
      return next(error);
    }
    res.json({ chats : latestMessage})
  }


  //get list of  trades 
  const getListofTrades = async (req , res ,next) => {
    let trades
    try{
        trades = await Notification.find({ },{ productID: 1, productsOffered: 1, message : 1, type: 1 , _id: 0 } )
        if (!trades || trades.length === 0) {
          return next(
            new HttpError('there are no trades with this type', 404)
          );
        }
      
    }
    catch(err){
        const error = new HttpError("can not fetch trades by provided type, something went wrong",500)
        return next(error)
    }
    

    

    res.json({ trades : trades })


  }


  //get list of Declined trades 
  const getListofDeclinedTrades = async (req , res ,next) => {
    let trades
    try{
        trades = await Notification.find({ type: "Declined" },{ productID: 1, productsOffered: 1, type: 1 , _id: 0 } )
        if (!trades || trades.length === 0) {
          return next(
            new HttpError('there are no trades with this type', 404)
          );
        }
      
    }
    catch(err){
        const error = new HttpError("can not fetch trades by provided type, something went wrong",500)
        return next(error)
    }
    

    

    res.json({ trades : trades })


  }


    //no of confirmed trades
const getConfirmedTradesCount = async (req ,res ,next) => {


  let trades
try{
    trades = await Notification.find({type : "Confirmed" }).countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch trades request",500)
    return next(error)
}
res.json({ trades : trades})


}

//no of declined trades
const GetDeclinedTradesCount = async (req ,res ,next) => {


  let trades
try{
    trades = await Notification.find({type : "Declined" }).countDocuments()
}
catch(err){
    const error = new HttpError("can not fetch trades request",500)
    return next(error)
}
res.json({ trades : trades})


}

//no of GettradeRequestTradesCount trades
const GettradeRequestTradesCount = async (req ,res ,next) => {


let trades
try{
  trades = await Notification.find({type : "tradeRequest" }).countDocuments()
}
catch(err){
  const error = new HttpError("can not fetch trades request",500)
  return next(error)
}
res.json({ trades : trades})


}
  
 //send push notification to sendNotificationToSpecficUser
 const sendNotificationToSpecficUser = async(req , res, next) => {

  const  { msgTitle,msgToUser ,fcmToken ,UserEmail, imgUrl}  =  req.body;

  let user;

try{
  user = await User.find({email : `${UserEmail}` });
}

catch(err){
    const error = new HttpError("can not fetch user request",500)
    return next(error)
}

if(!user){
  const error = new HttpError("user not found",404)
  return next(error)
}

let userFcmToken;
user.map((usr,i) => (
  
    userFcmToken = usr.fcmToken
  
))
    var message = {
      to: userFcmToken,
        notification: {
            title: `${msgTitle}`,
            body: `${msgToUser}`,
            image: `${imgUrl}`

        }
  
    };
    await fcm.send(message, function(err, response){
        if (err) {
          console.log(err)
          res.json({message : response})
        } else {
            console.log("sent")
            res.json({message : response})
        }
      })
  

 }



  //send push notification to all customers
  const sendNotificationCustomers = async(req , res, next) => {

  
    



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
    

    let fcmTokenOfCustomers = []
    let users
    try{
        users = await User.find({ userType: "Customer" },{ fcmToken: 1, _id: 0 } )
        if (!users || users.length === 0) {
          return next(
            new HttpError('there are no users with this type', 404)
          );
        }
       Object.values(users).map( usr => {
         console.log(typeof usr.fcmToken)
         let fcmt = usr.fcmToken;
         fcmTokenOfCustomers.push(fcmt)
       })
    }
    catch(err){
        const error = new HttpError("can not fetch users by provided type, something went wrong",500)
        return next(error)
    }


    

    // let fcmTokens
    // try{
    //     fcmTokens = await FcmIds.find()
    // }
    // catch(err){
    //     const error = new HttpError("can not fetch fcms complete request",500)
    //     return next(error)
    // }
  
    let fcmIds = [];
  
    let multifcmTokens= [] ;
 
      multifcmTokens  = fcmTokenOfCustomers
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
  
    //send push notification to all customers
  const sendNotificationVendors = async(req , res, next) => {

  
    



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
    

    let fcmTokenOfCustomers = []
    let users
    try{
        users = await User.find({ userType: "Vendor" },{ fcmToken: 1, _id: 0 } )
        if (!users || users.length === 0) {
          return next(
            new HttpError('there are no users with this type', 404)
          );
        }
       Object.values(users).map( usr => {
         console.log(typeof usr.fcmToken)
         let fcmt = usr.fcmToken;
         fcmTokenOfCustomers.push(fcmt)
       })
    }
    catch(err){
        const error = new HttpError("can not fetch users by provided type, something went wrong",500)
        return next(error)
    }


    

    // let fcmTokens
    // try{
    //     fcmTokens = await FcmIds.find()
    // }
    // catch(err){
    //     const error = new HttpError("can not fetch fcms complete request",500)
    //     return next(error)
    // }
  
    let fcmIds = [];
  
    let multifcmTokens= [] ;
 
      multifcmTokens  = fcmTokenOfCustomers
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
  

//exports.sendTradeRequest = sendTradeRequest;
exports.acceptTrade = acceptTrade;
exports.confirmTradeRequest =confirmTradeRequest;
exports.sendDualTradeNotification = sendDualTradeNotification;
exports.sendNotification = sendNotification;
exports.rejectTradeRequest = rejectTradeRequest;
exports.sendMessageToUser = sendMessageToUser;

exports.getAllMesageBasedOnRoomId = getAllMesageBasedOnRoomId;
exports.getListofTrades = getListofTrades;
exports.getConfirmedTradesCount = getConfirmedTradesCount;
exports.GetDeclinedTradesCount = GetDeclinedTradesCount;
exports.GettradeRequestTradesCount = GettradeRequestTradesCount;

exports.sendNotificationToSpecficUser = sendNotificationToSpecficUser;
exports.sendNotificationCustomers = sendNotificationCustomers;
exports.sendNotificationVendors = sendNotificationVendors;