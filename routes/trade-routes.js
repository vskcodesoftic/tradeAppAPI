const express = require('express');

const router = express.Router();

router.get('/', (req, res, next) => {
 
  res.json({message: 'trade routes'});
});

module.exports = router;