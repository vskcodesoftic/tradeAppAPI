const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const productController = require('../controllers/product-controller')

const checkAuth = require('../middleware/authService');

const hookFileUpload = require('../middleware/hook-file');

const multiFileUpload = require('../middleware/multiFile-upload');

router.get('/', (req, res, next) => {
 
  res.json({message: 'productPage routes'});
});


//updateproduct by id
router.patch(
  '/:pid', multiFileUpload.fields([{
    name: 'image', maxCount: 1
  },{  name: 'imgOptOne', maxCount: 6
  }]),
  productController.updateProduct
);

 //get list of products
 router.get('/list', productController.getProductsList);

 //get feautered  of products
 router.get('/featuredproducts', productController.getFeaturedProductsList);

 //get productslist by  category
 router.get('/category/:cid', productController.getProductsListbyCategory);

//getproductsby id
router.get('/uid', checkAuth,  productController.getProductsByUserId);

//getproductsby id
router.get('/p/:pid', productController.getProductById);


//delete product by id
  router.delete('/:pid', productController.deleteProduct);

  router.get('/all',productController.getAllProductsList);


module.exports = router;