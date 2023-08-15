const express=require('express')
const msgController=require('../controllers/adminacess')
const auth=require('../middleware/auth')
const router=express.Router();
router.get('/admin/addUser',auth.authentication,msgController.getAddUser)
router.get('/admin/allUsers', auth.authentication,msgController.getAllU);
module.exports=router;