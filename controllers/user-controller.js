
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

//user signup

const createUser = async (req, res, next) => {
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }
    const { name, email, password  , countryCode , phoneNumber } = req.body;
   

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
        password: hashedPassword,
        countryCode,
        phoneNumber,
        ip,
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
  
    const { title, description, modelNumber, category, creator } = req.body;
  
 
  
    const createdProduct = new Product({
      title,
      description,
      modelNumber,
      category,
      creator
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
  
    console.log(user);
  
    try {
      const sess = await mongoose.startSession();
      sess.startTransaction();
      await createdProduct.save({ session: sess });
      user.inventory.push(createdProduct);
      await user.save({ session: sess });
      await sess.commitTransaction();
    } catch (err) {
        console.log(err)
      const error = new HttpError(
        'Creating product failed, please try again.',
        500
      );
      return next(error);
    }
  
    res.status(201).json({ product: createdProduct });
  };
  


//user signup
exports.createUser =  createUser;
//user login
exports.userLogin =  userLogin;
//update user password based on old password
exports.updateUserPassword = updateUserPassword;
//post product
exports.createProduct = createProduct;