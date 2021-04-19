
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose');

let geoip = require('geoip-lite');

const { validationResult } = require('express-validator')
const  User = require('../models/user-schema')
const  Product = require('../models/product-schema');
const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')


//user signup

const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { name, email, dob, password ,nationality, country, nickname , countryCode , phoneNumber } = req.body;
   

    let geo = geoip.lookup(req.ip);
    const browser = req.headers["user-agent"];
    const ip = JSON.stringify(req.ip);
     
    let existingUser
    try{
         existingUser = await User.findOne({ email : email })
    }
    catch(err){
        const error = await new HttpError("something went wrong,creating a user failed",500)
        return next(error)
    }
    if(existingUser){
        const error = new HttpError("user already exists",422)
        return next(error)
    }
  
    
    let hashedPassword;
  
   try{
    hashedPassword = await bcrypt.hash(password, 12)
   } 
   catch(err){
       const error = new HttpError("could not create user",500);
       return next(error)
   }


    const createdUser = new User({
        name,
        email,
        dob,
        password: hashedPassword,
        countryCode,
        phoneNumber,
        ip,
        nationality,
        country,
        nickname,
        browser
     
    })

    try {
        await createdUser.save();
      } catch (err) {
        const error = new HttpError(
          'Creating User failed, please try again.',
          500
        );
        console.log(err)
        return next(error);
      }

      let token;
      try{
        token = await jwt.sign({
            userId : createdUser.id,
            email : createdUser.email 
             },
            process.env.JWT_KEY,
            {expiresIn :'1h'}
            )

      }
     catch (err) {
        const error = new HttpError(
          'Creating User failed, please try again.',
          500
        );
        return next(error);
      }
    
     
    res.status(201).json({ userId : createdUser.id,email : createdUser.email ,countrycode :createdUser.countryCode , phoneNumber :createdUser.phoneNumber, token: token})
}

//Customer login 
const  userLogin = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }

    const { email,password } = req.body;

    let user
    try{
         user = await User.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong,logging in failed",500)
        return next(error)
    }

    if(!user){
        const error = new HttpError("invalid credentials could not log in",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
         isValidPassword = await bcrypt.compare(password, user.password)
   }
   catch(err){
    const error = await new HttpError("invalid credentials try again",500)
    return next(error)
}

if(!isValidPassword){
    const error = new HttpError("invalid credentials could not log in",401)
    return next(error)
}

let token;
try{
  token = await jwt.sign({
      userId : user.id,
      email : user.email },
      process.env.JWT_KEY,
      {expiresIn :'1h'}
      )

}
catch (err) {
  const error = new HttpError(
    'LogIn failed, please try again.',
    500
  );
  return next(error);
} 
console.log("logged in");
res.json({ 
    message : 'user logged in successful' , 
    userId : user.id,
    email : user.email , 
    token: token})

}

//update password
const  updateUserPassword = async(req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { email, oldpassword , newpassword } = req.body;

    let user
    try{
         user = await User.findOne({ email : email  })
    }
    catch(err){
        const error = await new HttpError("something went wrong,update password in failed",500)
        return next(error)
    }

    if(!user){
        const error = new HttpError("user not found could not update password",401)
        return next(error)
    }
  
   let isValidPassword = false; 
   try{
         isValidPassword = await bcrypt.compare(oldpassword, user.password)
   }
   catch(err){
    const error = await new HttpError("invalid password try again",500)
    return next(error)
}


if(!isValidPassword){
    const error = new HttpError("invalid old password could not update newpassword",401)
    return next(error)
}

let hashedPassword;
  
try{
 hashedPassword = await bcrypt.hash(newpassword, 12)
 let founduser;
 founduser = await User.findOne({ email : email  })
  
 var updatedRecord = {
     password: hashedPassword
 }

 User.findByIdAndUpdate(founduser, { $set: updatedRecord },{new:true}, (err, docs) => {
     if (!err) res.json({mesage : "password updated sucessfully"})
     else console.log('Error while updating a record : ' + JSON.stringify(err, undefined, 2))
 })
} 
catch(err){
    const error = new HttpError("could not updated hash of user ",500);
    return next(error)
}


}

// post product 
const createProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {

      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description, modelNumber, category , subcategory ,isFeatured, quantity } = req.body;
  
     const creator = req.userData.userId;
  
    const createdProduct = new Product({
      title,
      description,
      modelNumber,
      category,
      subcategory,
      image : req.file.path ,
      creator,
      isFeatured,
      quantity,
      productid : uuid() 
    });
  
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
  
  

   /// checking balance and decrementing by -1 from balance after posting product  if no bal message error to purchase plan
   let userBal;
   try {
       userBal = await User.findOne({ _id : creator , Balance : { $lte : 0  } })
     }
        catch (err) {
     const error = new HttpError('Balnce checking , please try again', 500);
     console.log("error ")
     return next(error);
   }
 
   if(userBal){
    const error = new HttpError('purchase plan', 404);
    return next(error);
   }
   
     //check if userwants to feauture product or not if he wants to feature product then his balance will be deducted by -2 if he doesnt then -1
        
      if(isFeatured === "true"){
       console.log("isFeautured is "+isFeatured)
       try {
        const sess = await mongoose.startSession();
        sess.startTransaction();
        await createdProduct.save({ session: sess });
        user.inventory.push(createdProduct);
        await user.save({ session: sess });
        await sess.commitTransaction();
     
        await User.findByIdAndUpdate({ _id : creator }, { $inc: { Balance: -2, isFeatured : false  } });
  
  
  
      } catch (err) {
          console.log(err)
        const error = new HttpError(
          'Creating product failed, please try again.',
          500
        );
        return next(error);
      }
    
      res.status(201).json({ product: createdProduct });
      }
      else {

          
     
        console.log("isFeautured is "+isFeatured)
        try {
          const sess = await mongoose.startSession();
          sess.startTransaction();
          await createdProduct.save({ session: sess });
          user.inventory.push(createdProduct);
          await user.save({ session: sess });
          await sess.commitTransaction();
       
          await User.findByIdAndUpdate({ _id : creator }, { $inc: { Balance: -1 , isFeatured : true }});
    
    
    
        } catch (err) {
            console.log(err)
          const error = new HttpError(
            'Creating product failed, please try again.',
            500
          );
          return next(error);
        }
      
        res.status(201).json({ product: createdProduct });
       }
  
   
  };
  

  //get products by creatorId(objectId of user)

  const getProductsByUserId = async (req, res, next) => {
    const creator = req.params.uid;

    // replace add userId login after auth protect 
   // const creator = req.body;
  
    // let Products;
    let userWithProducts;
    try {
      userWithProducts = await User.findById(creator).populate('inventory');
    } catch (err) {
      const error = new HttpError(
        'Fetching places failed, please try again later',
        500
      );
      return next(error);
    }
  
    // if (!products || products.length === 0) {
    if (!userWithProducts || userWithProducts.inventory.length === 0) {
      return next(
        new HttpError('Could not find products for the provided user id.', 404)
      );
    }
  
    res.json({
      inventory: userWithProducts.inventory.map(product =>
        product.toObject({ getters: true })
      )
    });
  };
  
//get product by id

const getProductById = async (req, res, next) => {
    const productId = req.params.pid;
  
    let product;
    try {
        product  = await Product.findById(productId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not find a product.',
        500
      );
      return next(error);
    }
  
    if (!product) {
      const error = new HttpError(
        'Could not find a product for the provided id.',
        404
      );
      return next(error);
    }
  
    res.json({ product : product .toObject({ getters: true }) });
  };



//user signup
exports.createUser =  createUser;
//user login
exports.userLogin =  userLogin;
//update user password based on old password
exports.updateUserPassword = updateUserPassword;
//post product
exports.createProduct = createProduct;
//get products by creator id
exports.getProductsByUserId = getProductsByUserId;
//get product by product id
exports.getProductById = getProductById;