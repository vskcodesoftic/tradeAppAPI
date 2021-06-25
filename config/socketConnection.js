


const sentryCapture =  require('../services/sentry.service.js');

const Room = require('../models/room-schema');

const Notification = require('../models/notifications-schema');

const { addUser, getUser, deleteUser, getUsers } = require('../users')


const socketConnection = async(io) => {

  const secret = process.env.NODE_ENV === 'production' ? process.env.JWT_SECRET : 'secret';
  io.users = [];
  io.count = 0;
  io.on('connection', async (socket) => {
  
    console.log(socket.id)
    let roomId;
    let userName ;
  socket.on('login', ({ name ,room , notificationId }, callback) => {
    
    socket.on('clientDetails', function(data) {
      console.log(`${data.userId} name ${data.name}` );
   });
  
        const { user, error } = addUser(socket.id, name, room ,notificationId)
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
    socket.on('sendMessage',async (message) => {
    
   //save database if room id matches to on room model
  try {
   await Room.updateOne({ "roomId": roomId }, {
      "$push": {
          msg: `${userName} : ${message}`,
          partcipants : `${userName}`,
          chats: [{
            userId: userName,
            message: message
          }]
      }
  })
  
//populate message based on room id
    const latestMessage = await Room.findOne({  "roomId": roomId }).populate({ path: 'chats.userId', select: '_id' });
      const user = getUser(socket.id)
      io.in(user.room).emit('message', { user: user.name, text: message  ,chats :latestMessage})
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
};

exports.socketConnection = socketConnection;
