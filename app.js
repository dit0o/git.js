const path = require('path');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const morgan = require('morgan');
const app=express();
app.use(bodyParser.json());
const dotenv = require('dotenv');
dotenv.config();
const cors=require("cors")
app.use(cors());
const User = require('./model/user');
const Chat=require('./model/chat')
const Group=require('./model/group')
const Groupmembers=require('./model/membergroup')

const userRouter=require('./routes/user')
const msgRouter=require('./routes/message')
const adminRouter=require('./routes/admin')

const Sequelize=require('sequelize')
app.use(helmet());
const sequelize=require('./util/database')
const accessLogStream = fs.createWriteStream(
    path.join(__dirname, 'access.log'),
    { flags: 'a' }
);
app.use(morgan('combined', { stream: accessLogStream }));


app.use(userRouter)
app.use(msgRouter)
app.use(adminRouter)


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
    app.listen(4000); 
})
   .catch(err=>{
    console.log(err)
   });

