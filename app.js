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

const { addUser, getUser, deleteUser, getUsers } = require('./users');
const roomSchema = require("./models/room-schema");

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

app.get('/trades', (req, res) => {
  
  res.json({message : "hello"})
});

io.on('connection', async (socket) => {
  console.log(socket.id)
  const  notificationID =  "60bdc4ea9c1e6312af8d47c3"; 

  let notification;
  try {
    notification = await Notification.findById(notificationID);
  } catch (err) {
    console.log(err)
    const error = new HttpError(
      "Something went wrong, could not find a notification.",
      500
    );
    return next(error);
  }

  if (!notification) {
    const error = new HttpError(
      "Could not find a notification for the provided id.",
      404
    );
    return next(error);
  }

 
  //changinging isRead to true , type : accepted

   const roomId = await notification.roomId;
   const roomobjId = await notification._id;

   console.log(roomId)
  socket.on('login', ({ name ,notificationId }, callback) => {
      const { user, error } = addUser(socket.id, name, roomId ,notificationId)
      console.log(user.notificationId)
      if (error) return callback(error)
      socket.join(user.roomId)
      socket.in(roomId).emit('notification', { title: 'Someone\'s here', description: `${user.name} just entered the roomId` })
      io.in(roomId).emit('users', getUsers(roomId))
      callback()
  })



  let roooId;  
  try {
    roooId = Room.find({ roomId : `${roomId}`})
  }
  catch(Err){
    console.log(err)
  }

  if(!roooId){
  
  socket.on('sendMessage', message => {
   
    const messages = new Room({
      roomId : roomId,
      msg:message
    })
    
     messages.save().then(()=>{
      const user = getUser(socket.id)
      io.in(user.roomId).emit('message', { user: user.name, text: message });

     })
   
  })

}
else {
  let all = []
  socket.on('sendMessage', message => {
    all.push(`${message}`)
     
       Room.updateOne({ roomId : roomId }, {  msg : all }).then(()=>{
        const user = getUser(socket.id)
        io.in(user.roomId).emit('message', { user: user.name, text: message })
       })
    

   
  })

}
  socket.on("disconnect", () => {
      console.log("User disconnected");
      const user = deleteUser(socket.id)
      if (user) {
          io.in(user.roomId).emit('notification', { title: 'Someone just left', description: `${user.name} just left the room` })
          io.in(user.roomId).emit('users', getUsers(user.roomId))
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