const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const mongoose = require("mongoose");

const { validationResult } = require("express-validator");

const User = require("../models/user-schema");
const Product = require("../models/product-schema");

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
  const creator = req.userData;

  const {
    userproductId,
    offeredProductId,
    productIds = [],
    senderId,
    senderName,
    senderNationality,
    productsOffered,
  } = req.body;

  const fruits = await [`"${productIds}"`];

  const productId = userproductId; //(objectidofproduct)

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

  res.json({ dataOne: fruits[0], creatorEmail: creator.email });
};

exports.sendTradeRequest = sendTradeRequest;
