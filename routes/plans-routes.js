const express = require('express');
const { check } = require('express-validator')

const router = express.Router();

const userController = require('../controllers/user-controller')
const fileUpload = require('../middleware/file-upload');

const Admin = require('../firebase/config/firebase-config')


router.get('/', (req, res, next) => {
 
  res.json({message: 'plans page routes'});
});



module.exports = router;