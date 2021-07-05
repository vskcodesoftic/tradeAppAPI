const express = require('express');

const router = express.Router();

const tradeController = require('../controllers/trade-controller')

const checkAuth = require('../middleware/authService');


router.get('/', (req, res, next) => {
 
  res.json({message: 'trade routes'});
});

//router.post('/sendTradeRequest', checkAuth ,tradeController.sendTradeRequest)

router.get('/acceptTrade/:id' ,tradeController.acceptTrade);

router.get('/confirmTrade/:id',checkAuth ,tradeController.confirmTradeRequest);

router.post('/sendTradeRequest', checkAuth , tradeController.sendDualTradeNotification);

router.get('/rejectTradeRequest/:id', checkAuth , tradeController.rejectTradeRequest);

//send firebasemessage push notification
router.post('/firebase/notification'  , tradeController.sendNotification);

router.post('/sendMessage', checkAuth , tradeController.sendMessageToUser);

router.post('/getMessages', checkAuth , tradeController.getAllMesageBasedOnRoomId);

module.exports = router;