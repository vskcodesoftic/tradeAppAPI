const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const adminController = require('../controllers/admin-controller')

const fileUpload = require('../middleware/file-upload');


router.get('/', (req, res, next) => {
 
  res.json({message: 'admin page routes'});
});


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
router.post('/createPlan'  , adminController.createPlan);

//plans list
router.get('/list'  , adminController.getPlansList);

//updateplan 
router.patch('/updatePlan',adminController.updatePlan );

//delete plan by id
router.delete('/:pid', adminController.deletePlan);

//updateproduct visiblity
router.patch('/u/:pid', adminController.updateProductVisiblity);
module.exports = router;