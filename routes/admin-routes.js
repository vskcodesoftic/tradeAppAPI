const express = require('express');
const { check } = require('express-validator')

var multer  = require('multer');
var path  = require('path');

const router = express.Router();

const adminController = require('../controllers/admin-controller')

const fileUpload = require('../middleware/file-upload');

const checkAuth = require('../middleware/authService');




//admin login
router.post('/login',adminController.adminLogin);

//admin signup
router.post('/auth/create',adminController.createAdmin);


//get list of products
router.get('/usersList', adminController.getUsersList);


//postBannerImages
router.post('/banner/addImages',  fileUpload.single('image'), adminController.postBannerImages);

//getImages
router.get('/banner/getImages', adminController.getBannerImages);

//delete Banner images by id
router.delete('/banner/:bid', adminController.deleteBannerImageById);

//postAdvertisementImages
router.post('/adds/addImages', fileUpload.single('image'), adminController.postAdvertisementImages);

//getImages
router.get('/adds/getImages', adminController.getAdvertisementImages);

//postCategory
router.post('/category/addCategory'  , adminController.addCategory);

//getCategories
router.get('/category/getCategory'  , adminController.getCategories);


//create Plan
router.post('/plans/createPlan'  , adminController.createPlan);

//plans list
router.get('/plans/list'  , adminController.getPlansList);

//updateplan 
router.patch('/plans/updatePlan',adminController.updatePlan );

//delete plan by id
router.delete('/plans/:pid', adminController.deletePlan);

//updateplan by id
router.patch(
  '/plans/u/:pid',
  [
    check('title')
      .not()
      .isEmpty(),
    check('description').not().isEmpty(),
    check('amount').not().isEmpty().isNumeric(),
    check('posts').not().isEmpty().isNumeric(),
    check('type').not().isEmpty()
  ],
  adminController.updatePlanById
);

//updateproduct visiblity
router.patch('/plans/p/:pid', adminController.updateProductVisiblity);

//get users count
router.get('/getUsersCount', adminController.getUsersCount);

//get products count
router.get('/getProductsCount', adminController.getProductsCount);

//get feautred products count
router.get('/getFeauturedProductsCount', adminController.getFeauturedProductsCount);

//get payments count
router.get('/getPaymentsCount', adminController.getPaymentsCount);


module.exports = router;