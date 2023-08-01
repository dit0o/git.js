const path = require('path');
const express = require('express');
const bodyParser = require('body-parser');
const app=express();
app.use(bodyParser.json());
const dotenv = require('dotenv');
dotenv.config();
const cors=require("cors")
app.use(cors());
const User = require('./model/user');
const Chat=require('./model/chat')

const userRouter=require('./routes/user')
const msgRouter=require('./routes/message')

const Sequelize=require('sequelize')
const sequelize=require('./util/database')



app.use(userRouter)
app.use(msgRouter)


User.hasMany(Chat)
Chat.belongsTo(User)


sequelize.sync()
.then(result=>{
    app.listen(4000); 
})
   .catch(err=>{
    console.log(err)
   });

