const express=require('express')
const userController=require('../controllers/user')
const router=express.Router();
router.post('/user/signup',userController.postUser)
router.post('/user/login',userController.loginPost)
module.exports=router