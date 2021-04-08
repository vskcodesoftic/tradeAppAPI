const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const adminController = require('../controllers/admin-controller')


router.get('/', (req, res, next) => {
 
  res.json({message: 'admin page routes'});
});


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