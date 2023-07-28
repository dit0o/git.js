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
const userRouter=require('./routes/user')
const Sequelize=require('sequelize')
const sequelize=require('./util/database')
app.use(userRouter)
sequelize.sync()
.then(result=>{
    app.listen(4000); 
})
   .catch(err=>{
    console.log(err)
   });

