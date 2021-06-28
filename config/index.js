const dotenv  = require('dotenv');

dotenv.config();

const config = {
  mailOptions: {
    from: 'siva.codesoftic@gmail.com',
    signup: {
      subject: 'Verify your badinly account',
      text: 'Hello world',
      html: '<b>Hello world?</b>',
    },
  },
};

exports.config = config;
