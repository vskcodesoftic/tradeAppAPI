const express = require('express');
const { check } = require('express-validator')

var multer  = require('multer');
var path  = require('path');

const router = express.Router();

const adminController = require('../controllers/admin-controller')

const fileUpload = require('../middleware/file-upload');

const hookFileUpload = require('../middleware/hook-file');

const checkAuth = require('../middleware/authService');

const multiFileUpload = require('../middleware/multiFile-upload');



//admin login
router.post('/login',adminController.adminLogin);

//admin signup
router.post('/auth/create',adminController.createAdmin);

//get list of users
router.get('/usersList', adminController.getUsersList);

//change Password based on old password
router.post('/changePassword' ,adminController.updateAdminPassword);

//get list of admins
router.get('/adminsList', adminController.getAdminsList);

//delete admins  by id
router.delete('/admin/:aid', adminController.deleteAdminById);

//postBannerImages
router.post('/banner/addImages',  fileUpload.single('image'), adminController.postBannerImages);

//getImages
router.get('/banner/getImages', adminController.getBannerImages);

//delete Banner images by id
router.delete('/banner/:bid', adminController.deleteBannerImageById);

//updateBannerById
router.patch(
  '/baneer/b/:bid', fileUpload.single('image'),
  adminController.updateBannerById
);

//updateAdvertisementById
router.patch(
  '/adds/a/:bid', fileUpload.single('image'),
  adminController.updateAdvertisementById
);

router.get('/getCats', adminController.CategoryList)

//getSubCategories
router.get('/getSubs',adminController.SubCategoryList)

//postAdvertisementImages
router.post('/adds/addImages', fileUpload.single('image'), adminController.postAdvertisementImages);

//getImages
router.get('/adds/getImages', adminController.getAdvertisementImages);

//delete Banner images by id
router.delete('/adds/:aid', adminController.deleteAddsImageById);

//get Banner images by id
router.get('/banner/:bid', adminController.getBannerImageById);


//postCategory
router.post('/category/addCategory'  , adminController.addCategory);

//postSubCategorybyId
router.patch('/category/addSubCategory/:cid'  , adminController.addSubCategory);

//getSubCategories
router.get('/category/sub/:cid',adminController.getSubCategories)

//getCategories
router.get('/category/getCategory'  , adminController.getCategories);

//delete category by id
router.delete('/category/:cid', adminController.deleteCategoryByID);

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

//update user status by id
//updateplan by id
router.patch(
  '/users/u/:uid',
  [
    check('status')
      .not()
      .isEmpty()
  
  ],
  adminController.updateUserById
);

router.delete('/users/:uid', adminController.deleteUserById);


router.post('/postItem' , multiFileUpload.fields([{
  name: 'image', maxCount: 1
},{  name: 'imgOptOne', maxCount: 6
}]),
adminController.createProduct);

module.exports = router;