const express = require('express');
let url = require('url');

const router = express.Router();

const checkAuth = require('../middleware/authService');

const paymentController = require('../controllers/payment-controller')
router.get('/', (req, res, next) => {
 
  res.json({message: 'payment routes'});
});


// pass checkAuth in production

//down here in /pay
//pay simple
router.post('/pay' ,checkAuth,
paymentController.createPayment);



//pay routue based on plan type 
router.get('/pay/:pid/creator/:cid'  ,
paymentController.createBasicPayment);

//pay routue based on plan type 
router.get('/freeplan/f/c/:pid'  , checkAuth, 
paymentController.FreePayment);

//post payment
router.get('/successUrl/:postId/creator/:cId',
paymentController.successUrl);

//post  error url payment
router.get('/errorUrl',
paymentController.errorUrl);


//payments list
router.get('/paymentslist'  , paymentController.getPaymentsList);


module.exports = router;