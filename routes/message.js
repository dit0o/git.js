const express=require('express')
const msgController=require('../controllers/msg')
const auth=require('../middleware/auth')
const router=express.Router();
router.get('/user/message',auth.authentication,msgController.getMessage)
router.post('/user/postmeg',auth.authentication,msgController.postMsg)
module.exports=router;