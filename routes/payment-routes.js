const express = require('express');

const router = express.Router();

const checkAuth = require('../middleware/authService');

const paymentController = require('../controllers/payment-controller')
router.get('/', (req, res, next) => {
 
  res.json({message: 'payment routes'});
});

//post product
router.post('/pay',
paymentController.createPayment);

module.exports = router;