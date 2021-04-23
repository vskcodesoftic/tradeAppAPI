
const mongoose = require('mongoose');


const { validationResult } = require('express-validator')

const  User = require('../models/user-schema')
const  Product = require('../models/product-schema')
const Banner = require('../models/banner-schema');
const Advertisement = require('../models/advertisement-schema');
const  Plan = require('../models/plans-schema');

const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')




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
      product = await Product.updateOne(
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
  

  
  exports.createPlan =createPlan ;
  exports.getPlansList = getPlansList;
  exports.updatePlan = updatePlan;
  exports.deletePlan = deletePlan;
  exports.updateProductVisiblity = updateProductVisiblity;
  exports.postBannerImages = postBannerImages;
  exports.getBannerImages = getBannerImages;
  exports.postAdvertisementImages = postAdvertisementImages;
  exports.getAdvertisementImages = getAdvertisementImages;