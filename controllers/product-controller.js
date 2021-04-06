
const mongoose = require('mongoose');


const { validationResult } = require('express-validator')
const  User = require('../models/user-schema')
const  Product = require('../models/product-schema');
const HttpError = require('../middleware/http-error');

const { v1: uuid } = require('uuid')



//get list of products 
const getProductsList = async (req, res, next) => {
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

//get list of  products by category
const getProductsListbyCategory = async (req, res, next) => {
  let getCategory = req.params.cid;
  let products
  try{
      products = await Product.find({ category : getCategory })
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
      products = await Product.find({ isFeatured : "false" })
  }
  catch(err){
      const error = new HttpError("can not fetch products complete request",500)
      return next(error)
  }
  res.json({ products : products.map( product => product.toObject({ getters : true}))})
  
}


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
  
    const { title, description } = req.body;
    const productId = req.params.pid;
  
    let product;
    try {
      product = await Product.findById(productId);
    } catch (err) {
      const error = new HttpError(
        'Something went wrong, could not update product.',
        500
      );
      return next(error);
    }
  
    product.title = title;
    product.description = description;
  
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

