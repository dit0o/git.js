const jwt=require('jsonwebtoken')
const User=require('../model/user')
exports.authentication=(req,res,next)=>{
    try {
        
        const token=req.header('Authorization')
        const user=jwt.verify(token,process.env.TOKEN_SECRET)
        
        User.findByPk(user.id).then(user=>{
            req.user=user;//it is used to find the right user in getday expenses
            next();
        })
    } 
    catch (error) {
        return res.status(401).json({success:false})
    }
}