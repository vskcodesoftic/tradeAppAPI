const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const adminController = require('../controllers/admin-controller')

const fileUpload = require('../middleware/file-upload');


router.get('/', (req, res, next) => {
 
  res.json({message: 'admin page routes'});
});

//get list of products
router.get('/usersList', adminController.getUsersList);


//postBannerImages
router.post('/banner/addImages', fileUpload.single('image'), adminController.postBannerImages);

//getImages
router.get('/banner/getImages', adminController.getBannerImages);

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

//updateproduct visiblity
router.patch('/plans/p/:pid', adminController.updateProductVisiblity);
module.exports = router;