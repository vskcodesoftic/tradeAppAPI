const express = require('express');
let url = require('url');

const router = express.Router();

const checkAuth = require('../middleware/authService');

const paymentController = require('../controllers/payment-controller')
router.get('/', (req, res, next) => {
 
  res.json({message: 'payment routes'});
});


// pass checkAuth in production


//post product
router.post('/pay' ,
paymentController.createPayment);


//post product
router.post('/pay/:pid' ,
paymentController.createBasicPayment);


//post payment
router.get('/successUrl',
paymentController.successUrl);

module.exports = router;