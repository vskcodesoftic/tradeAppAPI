const express = require('express');

const router = express.Router();

const tradeController = require('../controllers/trade-controller')

const checkAuth = require('../middleware/authService');


router.get('/', (req, res, next) => {
 
  res.json({message: 'trade routes'});
});

//router.post('/sendTradeRequest', checkAuth ,tradeController.sendTradeRequest)

router.get('/acceptTrade/:id' ,checkAuth,tradeController.acceptTrade);

router.get('/confirmTrade/:id',checkAuth ,tradeController.confirmTradeRequest);

router.post('/sendTradeRequest', checkAuth , tradeController.sendDualTradeNotification);

router.get('/rejectTradeRequest/:id', checkAuth , tradeController.rejectTradeRequest);

//send firebasemessage push notification
router.post('/firebase/notification'  , tradeController.sendNotification);

router.post('/sendMessage', checkAuth , tradeController.sendMessageToUser);

router.post('/getMessages', checkAuth , tradeController.getAllMesageBasedOnRoomId);

router.get('/getAllTrades', tradeController.getListofTrades);

router.get('/getConfirmedTradesCount', tradeController.getConfirmedTradesCount);

router.get('/getListofDeclinedTrades', tradeController.GetDeclinedTradesCount)

router.get('/getTradeRequestTradesCount', tradeController.GettradeRequestTradesCount)

//send firebasemessage push notification
router.post('/firebase/SendNotification', tradeController.sendNotificationToSpecficUser);

//send firebasemessage push notification
router.post('/firebase/SendNotificationToUsers', tradeController.sendNotificationCustomers);

//send firebasemessage push notification
router.post('/firebase/SendNotificationToVendors', tradeController.sendNotificationVendors);

module.exports = router;