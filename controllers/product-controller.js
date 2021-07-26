
const mongoose = require('mongoose');


const { validationResult } = require('express-validator')
const  User = require('../models/user-schema')
const  Product = require('../models/product-schema');
const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')



//get list of products 
const getProductsList = async (req, res, next) => {

  const d =[]

//checking products expiry

// the products which are featured but expired 15days since accpetance of trade  we are resttting isShow to true andd token to current date

  let product
  try{
     // product = await Product.find({expireToken:{$lt:Date.now()} , isShow : false })
     product = await Product.find({  $and: [
      { $and: [  { expireToken : { $gt: Date.now()} } ] },
      { $and: [ { isShow: false }, { isFeatured : true } ] }
  ] })

  }
  catch(err){
      const error = new HttpError("can not fetch products complete request",500)
      return next(error)
  }
  if(product) {
  const pids = []
   product.map( p =>   pids.push(p.id)  
    ) 

  pids.forEach(function (item, index) {
         d.push(item)
  });

  }
  else if(!product){
    const error = new HttpError(
      "Could not find a product for the provided ids",
      404
    );
    return next(error);
  }


 let products
 var i;
 for (i = 0; i < d.length; i++) {
  try{   
      products = await Product.findById(d[i]);
      //await Product.find({ expireToken:{$lt:Date.now()}})
  }
  catch(err){
    console.log(err)
      const error = new HttpError("can not fetch products complete request",500)
      return next(error)
  }
 
  
  // products.isShow = true
  // products.expireToken = " "

  let updatedRecord = {
    isShow: true,
    status : "active",
    expireToken : null
}

  //res.json({ title : pTtile})
  //products.isShow = "false";
  
    try {
      await  Product.findByIdAndUpdate(products, { $set: updatedRecord },{new:true})
    } catch (err) {
      console.log(err)
      const error = new HttpError(
        'Something went wrong, could not update the lok product.',
        500
      );
      return next(error);
    }
  }




//displaying products


let productsupdated
try{
    productsupdated = await Product.find({ isShow : true , isFeatured : true , status: "active", })
}
catch(err){
    const error = new HttpError("can not fetch products complete request",500)
    return next(error)
}
res.json({ products : productsupdated.map( product => product.toObject({ getters : true})) })

}



//get list of  products by category
const getProductsListbyCategory = async (req, res, next) => {
  let getCategoryId = req.params.cid;
  let products
  try{
      products = await Product.find({ categoryId : getCategoryId })
      if (!products || products.length === 0) {
        return next(
          new HttpError('there are no products with this category', 404)
        );
      }
    
  }
  catch(err){
      const error = new HttpError("can not fetch products by provided category, something went wrong",500)
      return next(error)
  }
  
  res.json({ products : products.map( product => product.toObject({ getters : true}))})
  
}



//get list of featured products 
const getFeaturedProductsList = async (req, res, next) => {
  let products
  try{
      products = await Product.find({ isFeatured : "true", isShow :"true" })
  }
  catch(err){
      const error = new HttpError("can not fetch products complete request",500)
      return next(error)
  }
  res.json({ products : products.map( product => product.toObject({ getters : true}))})
  
}


  //get products by creatorId(objectId of user)

  const getProductsByUserId = async (req, res, next) => {

    //replace add userId login after auth protect 
    const creator = req.userData.userId;

    //const creator = "608a786244e074b5a4dcaec9"
  
    // let Products;
    let userWithProducts;
    try {
      userWithProducts = await User.findById(creator).populate('inventory');
    } catch (err) {
      const error = new HttpError(
        'Fetching products failed, please try again later',
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
    const productId = req.params.pid; //(objectidofproduct)
  
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

//update product
  const updateProduct = async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return next(
        new HttpError('Invalid inputs passed, please check your data.', 422)
      );
    }
  
    const { title, description , category, subcategory, recommendCategory,recommendSubcategory, status, isFeatured, quantity } = req.body;
    const productId = req.params.pid;
  
    let RecommendSubs = []
    RecommendSubs = recommendSubcategory.split(',')

    //holder for optional images
   let imgoptArr =[]
    
   // holder for single image
   let  imgOne;

   let finalImages = []
   let SingleFilePath 
   let imgPath ;

    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not found to  update product.',
        500
      );
      return next(error);
    }
    

    //accesing array of previous images
    imgoptArr = product.imgOptOne;
    //accesing single image 
    imgOne = product.image;

  
    const files = req.files.imgOptOne;
    const fileSingle = req.files.image;
   

   if(!files){
     
    finalImages = imgoptArr;
    console.log("optional images :",finalImages)
    
   }

 
    
    if(files){
   
     files.forEach(img => {
       console.log(img.path)
        imgPath = img.path;
       finalImages.push(imgPath)
     })
   }
 
   if(!fileSingle){
    SingleFilePath =imgOne;
   }
   
   if(fileSingle){
   fileSingle.forEach(img => {
     console.log(img.path)
      imgPath = img.path;
      SingleFilePath = imgPath
   })
  }
 


    product.title = title;
    product.description = description;
    product.image = SingleFilePath;
    product.imgOptOne  = finalImages;
    product.status = status;
    product.isFeatured = isFeatured;
    product.quantity = quantity;
    product.category = category;
    product.subcategory = subcategory;
    product.recommendCategory = recommendCategory;
    product.recommendSubcategory = RecommendSubs;

    try {
      await product.save();
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update the  product.',
        500
      );
      return next(error);
    }
  
    res.status(200).json({ product: product.toObject({ getters: true }) });
  };
  

//delete product by id
const deleteProduct = async (req, res, next) => {
    const productId = req.params.pid;
    Product.findByIdAndRemove(productId)
    .then((result) => {
      res.json({
        success: true,
        msg: `product has been deleted.`,
        result: {
          _id: result._id,
          title: result.title,
        }
      });
    })
    .catch((err) => {
      res.status(404).json({ success: false, msg: 'Nothing to delete with provided id.' });
    });

  };
  

//get list of featured products 
const getAllProductsList = async (req, res, next) => {
  let products
  try{
      products = await Product.find()
  }
  catch(err){
      const error = new HttpError("can not fetch products complete request",500)
      return next(error)
  }
  res.json({ products : products.map( product => product.toObject({ getters : true}))})
  
}

//get products by creator id
exports.getProductsByUserId = getProductsByUserId;
//get product by product id
exports.getProductById = getProductById;
//updateProduct
exports.updateProduct = updateProduct;
//deleteProductById
exports.deleteProduct = deleteProduct;
//get list of products
exports.getProductsList = getProductsList;
//get list of feautered  products
exports.getFeaturedProductsList = getFeaturedProductsList;
//get products list  based on  category
exports.getProductsListbyCategory = getProductsListbyCategory;
//getallproducts
exports.getAllProductsList = getAllProductsList;
