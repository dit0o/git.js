const path = require('path');
const fs = require('fs');
const express = require('express');
const cors=require("cors")
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');

const dotenv = require('dotenv');
dotenv.config();


const User = require('./model/user');
const Chat=require('./model/chat')
const Group=require('./model/group')
const Groupmembers=require('./model/membergroup')

const userRouter=require('./routes/user')
const msgRouter=require('./routes/message')
const adminRouter=require('./routes/admin')


const sequelize=require('./util/database')
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);

const app=express();
const httpServer = require("http").createServer(app);
const socketio = require("socket.io")
const io = socketio(httpServer,{
    cors:{
        origin : ['*','http://127.0.0.1:5500'],
    methods: ['GET', 'POST']
    }
});
app.use(cors({
    origin : ['*','http://127.0.0.1:5500'],
    methods: ['GET', 'POST']
    
}))

app.use(helmet());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(bodyParser.json());

app.use(userRouter)
app.use(msgRouter)
app.use(adminRouter)
//app.use((req,res)=>{
    //console.log('url>>', req.url);
  // res.sendFile(path.join(__dirname,`public/${req.url}`))
//})


User.hasMany(Chat)
Chat.belongsTo(User)

User.hasMany(Group);
Group.belongsTo(User);

Group.hasMany(Chat);
Chat.belongsTo(Group);

User.hasMany(Groupmembers);
Groupmembers.belongsTo(User);

Group.hasMany(Groupmembers);
Groupmembers.belongsTo(Group);


sequelize.sync()
.then(result=>{
    httpServer.listen(4000); 
})
   .catch(err=>{
    console.log(err)
   });

   io.on('connection',socket=>{
    socket.on('send-chat-message', message => {
        socket.broadcast.emit('chat-message', message)
    });
});
