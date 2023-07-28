const User=require('../model/user')
const bcrypt=require('bcrypt')
const jwt = require('jsonwebtoken');
exports.postUser=async(req,res,next)=>{
    try {
        const{Name,Email,PhoneNumber,Password}=req.body;
     let userExist=await User.findAll({where:{Email}});
     if(!userExist.length){
        userExist=await User.findAll({where:{PhoneNumber}});

     }
     if(userExist && userExist.length){
        res.status(201).json({ message: 'User already exist, Please Login' });
    } 
    else{
        const saltrounds=5;
        bcrypt.hash(Password,saltrounds,async(err,hash)=>{
            if(err){
                console.log(err);

            }
            await User.create({Name,Email,PhoneNumber,Password:hash});
            res.status(202).json({message:'User signup successfull'})
        })
    }

    } catch (err) {
        console.log(err)
        res.status(500).json({error:err})
    }
}
function generateAccessToken(id,Name){
    return jwt.sign({id,Name},process.env.TOKEN_SECRET);
}
exports.loginPost=async(req,res)=>{
    try {
      const Email=req.body.Email;
      const Password=req.body.Password;
      const user=await User.findAll({where:{Email}})
      if(user.length>0){
        bcrypt.compare(Password,user[0].Password,(err,result)=>{
         if(err){
          throw new Error('Something went wrong')
         
        }
        if(result===true){ 
          res.status(201).json({message:"user successfully loged",token:generateAccessToken(user[0].id,user[0].Name)})
        }
        else{
          res.status(400).json({message:"password not matched"})
        }
      })
    }
        else{
          res.status(404).json({message:"user not found"})
        }
      
      }
      
       catch (error) {
      res.status(500).json({message:error})
    }
  }
  
