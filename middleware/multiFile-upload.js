const multer = require('multer');
const path = require('path');

const { v1: uuid } = require('uuid')


const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const multiFileUpload = multer({
    limits: 500000,
    storage : multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/assets/images');
  },
  filename: (req, file, cb) => {
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, uuid() + '.' + ext);
  },
  fileFilter: (req, file, cb) => {
    const isValid = !!MIME_TYPE_MAP[file.mimetype];
    let error = isValid ? null : new Error('Invalid mime type!');
    cb(error, isValid);
  }
})
});


module.exports = multiFileUpload;

