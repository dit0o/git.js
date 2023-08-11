const Chat=require('../model/chat')
const User=require('../model/user')
const Group=require('../model/group')
const Groupmembers=require('../model/membergroup')
const jwt = require('jsonwebtoken');
exports.postMsg=async(req,res,next)=>{
    try {
        const{id}=req.user;
        const message=req.body.message;
        const gId=req.query.gId;
        console.log(gId)
        const mesg = await Chat.create( {message, userId:id,groupId:gId});
        res.status(200).json({mesg, Name});
        
    } catch (error) {
        res.status(500).json({error,success: false}); 
    }
   
}
exports.getMessage = async (req,res,next)=>{
    try{
     
        const lastId=+req.query.lastId || 0;
        const gId = +req.query.gId;
        console.log(gId)
        console.log(lastId)
    let mesg = await Chat.findAll({offset:lastId ,include:[
{
    model:User,
    attributes: ['id', 'Name']

}
],where:{
    groupId:gId
}
});
    res.status(200).json({mesg});
    } catch(error) {
        console.log(error);
        res.status(500).json({error,success: false});
    }
}
exports.postCreatgroup=async(req,res,next)=>{
    try {
        const eId=req.user.id;
        const {gName}=req.body;
        const newGroup=await Group.create({gName,userId:eId});
        const nGId=newGroup.dataValues.id;
        const groupmem=await Groupmembers.create({userId:eId,groupId:nGId})
        res.status(200).json({newGroup,groupmem,success:true});
    }catch(error){
        console.log(error);
        res.status(500).json({error,success:false});
    }
        
  
}
exports.getAllG = async(req,res,next) => {
    try {
        const reqId = req.user.id;
        let allGroup = await Groupmembers.findAll({
            include: [{
                model: Group,
                attributes: ['gName']
            }]
            ,where: {
                userId: reqId
            }
        });
        res.status(200).json({allGroup});
    } catch (error) {
        console.log(error);
        res.status(500).json({error,success:false});
    }
}