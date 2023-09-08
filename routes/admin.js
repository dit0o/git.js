const express=require('express')
const msgController=require('../controllers/adminacess')
const auth=require('../middleware/auth')
const router=express.Router();
router.get('/user/message/addUser',auth.authentication,msgController.getAddUser)
router.get('/user/message/allUsers', auth.authentication,msgController.getAllU);
router.get('/user/message/removeU',auth.authentication, msgController.getRemU);
router.get('/user/message/makeA',auth.authentication, msgController.getMakeA);
module.exports=router;