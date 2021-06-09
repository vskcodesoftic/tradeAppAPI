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

const Room = require('./models/room-schema');

const Notification = require('./models/notifications-schema');


const app = express();


const http = require("http").Server(app);
const io = require("socket.io")(http);

const { addUser, getUser, deleteUser, getUsers } = require('./users')

app.use(cors());


//ejs
app.set('view engine', 'ejs');


//body parsing jsonData
app.use(bodyParser.json())
//routes

//static serving
app.use(express.static('public'));


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

io.on('connection', async (socket) => {
  
 
  
  console.log(socket.id)
  let roomId;
  let userName ;
socket.on('login', ({ name ,room , notificationId }, callback) => {
  socket.on('clientDetails', function(data) {
    console.log(`${data.userId} name ${data.name}` );
 });

      const { user, error } = addUser(socket.id, name, room ,notificationId)
      console.log(user.notificationId)
      roomId = user.room
      userName = user.name
      NotificationID = user.notificationId
      if (error) return callback(error)
      socket.join(user.room)
      socket.in(room).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the roomId` })
      io.in(room).emit('users', getUsers(room))
      callback()
  })



  let roooId;  
  try {
    roooId = Room.find({roomId : `${roomId}`})
  }
  catch(Err){
    console.log(Err)
  }

  if(!roooId){
  socket.on('sendMessage', message => {
try {
  const messages = new Room({
    roomId ,
    msg:message
  })
   messages.save().then(()=>{
    const user = getUser(socket.id)
    io.in(user.room).emit('message', { user: user.name, text: message });

   })
} catch (error) {
  console.log(error)
}
    
   
  })

}
else {
  let all = []
  let allmsg = []
  socket.on('sendMessage', message => {
  
 //save database if room id matches to on room model
try {
  Room.updateOne({ "roomId": roomId }, {
    "$push": {
        "msg": `${userName} : ${message}`,
        "partcipants" : `${userName}`
    }
}).then(()=>{
    const user = getUser(socket.id)
    io.in(user.room).emit('message', { user: user.name, text: message })
   })

} catch (error) {
  console.log(error)
}
     
  
   
  })

}
  socket.on("disconnect", () => {
      console.log("User disconnected");
      const user = deleteUser(socket.id)
      if (user) {
          io.in(user.room).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
          io.in(user.room).emit('users', getUsers(user.room))
      }
  })
 
 
})




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
    http.listen(process.env.PORT || 8001, function(){
      console.log("Express server listening on port %d in %s mode", this.address().port, app.settings.env);
    });;
  
  })
  .catch(err => {
    console.log(err);
  });