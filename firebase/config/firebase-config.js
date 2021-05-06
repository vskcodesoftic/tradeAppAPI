
const admin = require("firebase-admin");

var serviceAccount = require("./firebasecred.json");

const Admin = (req,res,next) => {
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://tradeapibadinly-default-rtdb.firebaseio.com"
});
}
module.exports.Admin = Admin;