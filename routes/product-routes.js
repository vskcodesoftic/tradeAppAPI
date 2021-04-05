const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const productController = require('../controllers/product-controller')

router.get('/', (req, res, next) => {
 
  res.json({message: 'productPage routes'});
});



//getproductsby id
router.get('/:uid', productController.getProductsByUserId);

//getproductsby id
router.get('/p/:pid', productController.getProductById);
//updateproduct
router.patch(
    '/:pid',
    [
      check('title')
        .not()
        .isEmpty(),
      check('description').not().isEmpty()
    ],
    productController.updateProduct
  );


  router.delete('/:pid', productController.deleteProduct);

module.exports = router;