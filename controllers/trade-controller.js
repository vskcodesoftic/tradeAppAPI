
const bcrypt = require('bcryptjs')
const crypto = require('crypto')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const mongoose = require('mongoose');

const { validationResult } = require('express-validator')

const  User = require('../models/user-schema')
const  Product = require('../models/product-schema');

const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')



const sendTradeRequest = async (req, res, next) => {
   
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        console.log(errors);
        const error =  new HttpError("invalid input are passed,please pass valid data",422)
        return next(error)
    }

    const { title , message , senderId  , senderName , senderNationality , productsOffered, creator} = req.body;
    


}

exports.sendTradeRequest = sendTradeRequest;

