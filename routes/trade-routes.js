const express = require('express');

const router = express.Router();

const tradeController = require('../controllers/trade-controller')

const checkAuth = require('../middleware/authService');


router.get('/', (req, res, next) => {
 
  res.json({message: 'trade routes'});
});

router.post('/sendTradeRequest', checkAuth ,tradeController.sendTradeRequest)

router.post('/acceptTrade', checkAuth ,tradeController.acceptTrade)



module.exports = router;