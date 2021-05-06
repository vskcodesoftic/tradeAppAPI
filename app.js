require("dotenv").config()
//dotenv for envoirment variables

//ejs
const ejs = require('ejs');

const express = require('express');

const path = require('path'); 

const cors = require('cors');


const bodyParser = require('body-parser');
const mongoose = require('mongoose')
const HttpError = require('./middleware/http-error')

const homepageRoutes = require('./routes/home-routes')

const userPageRoutes = require('./routes/user-routes');

const adminPageRoutes = require('./routes/admin-routes');

const productPageRoutes = require('./routes/product-routes');

const planPageRoutes = require('./routes/plans-routes');

const paymentPageRoutes = require('./routes/payment-routes');

const tradePageRoutes = require('./routes/trade-routes');

const app = express();

app.use(cors());


//ejs
app.set('view engine', 'ejs');


//body parsing jsonData
app.use(bodyParser.json())
//routes


app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested-With, Content-Type, Accept, Authorization'
  );
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');

  next();
});


// set public directory to serve static html files 
app.use('/', express.static(path.join(__dirname, 'public'))); 

// set public directory to serve static html files 
app.use('/public', express.static(path.join(__dirname, 'public'))); 


app.use(homepageRoutes);

//customer Routes
app.use('/api/user/',userPageRoutes);

//admin Routes
app.use('/api/admin/',adminPageRoutes);

//productPage Routes
app.use('/api/product/',productPageRoutes);

//plansPage Routes
app.use('/api/plan/',planPageRoutes);

//payment Routes
app.use('/api/payment/',paymentPageRoutes);

//trade routes
app.use('/api/trade/',tradePageRoutes);


app.use((req, res, next)=>{
    const error = new HttpError('could not found this Route', 404);
    throw error;
})

// error model middleware
app.use((error, req, res, next) => {

    if (res.headerSent) {
      return next(error);
    }
    res.status(error.code || 500)
    res.json({message: error.message || 'An unknown error occurred!'});
  });

  mongoose.connect(process.env.MONGO_PROD_URI,{  useNewUrlParser: true , useUnifiedTopology: true ,useFindAndModify : false ,'useCreateIndex' : true })
  .then(() => {
    console.log("server is live");
    app.listen(process.env.PORT || 8000, function(){
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });;
  
  })
  .catch(err => {
    console.log(err);
  });