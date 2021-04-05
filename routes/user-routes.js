const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const userController = require('../controllers/user-controller')
const fileUpload = require('../middleware/file-upload');


router.get('/', (req, res, next) => {
 
  res.json({message: 'user page routes'});
});



//customer signup
//for creating a new user
router.post('/signup',
[ check('name').not().isEmpty(),
  check('email').isEmail(),
  check('password').isLength({ min : 6}),
  check('countryCode').isLength({min :2 , max:2}),
  check('phoneNumber').not().isEmpty(), 
],userController.createUser);


//userlogin
router.post('/login' ,[ check('email').isEmail(), check('password').not().isEmpty()], userController.userLogin);
//updatePassword
router.post('/updatePassword'  ,[ check('email').isEmail(), check('oldpassword').not().isEmpty(),check('newpassword').not().isEmpty()], userController.updateUserPassword);

//post product
router.post('/postItem',fileUpload.single('image'),
userController.createProduct);

//getproductsby id
router.get('/id/:uid', userController.getProductsByUserId);

//getproductsby id
router.get('/product/:pid', userController.getProductById);


module.exports = router;