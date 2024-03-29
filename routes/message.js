const express=require('express')
const msgController=require('../controllers/msg')
const auth=require('../middleware/auth')
const router=express.Router();
router.get('/user/message',auth.authentication,msgController.getMessage)
router.post('/user/message',auth.authentication,msgController.postMsg)
router.post('/user/message/creategroup',auth.authentication,msgController.postCreatgroup)
router.get('/user/message/allgroup',auth.authentication,msgController.getAllG)
router.get('/user/message/getInvite',auth.authentication,msgController.getInvite)
router.get('/user/message/joinGroup',auth.authentication,msgController.getJoinGroup)
module.exports=router;