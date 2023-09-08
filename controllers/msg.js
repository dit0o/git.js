const Chat=require('../model/chat')
const User=require('../model/user')
const Group=require('../model/group')
const Groupmembers=require('../model/membergroup')
const jwt = require('jsonwebtoken');
const s3 = require('../services/S3services');
const formidable = require('formidable');
const path = require('path');
const fs = require('fs');
exports.postMsg=async(req,res,next)=>{
    try {
        const{id}=req.user;
        const{Name}=req.user;
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
        const groupmem=await Groupmembers.create({userId:eId,groupId:nGId,isAdmin:true})
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
function generateAccessToken(id){
    return jwt.sign({id},process.env.TOKEN_SECRET);
}

exports.getInvite=async(req,res,next)=>{
    try {
const gId=req.query.gId;
console.log(gId);
res.status(200).json({
    secretToken: generateAccessToken(gId)
});
        
    } catch (error) {
        res.status(505).json({sms:"something not right"})
    }
}
exports.getJoinGroup = async(req,res,next) => {
    const gId = req.query.gId;
    const uId = req.user.id;
    const groupmem = await Groupmembers.create({userId:uId, groupId:gId,isAdmin:false});
    res.status(200).json({groupmem,success:true});
}
exports.postSaveFile = async(req,res,next)=>{
    try{
        const gId = req.header('groupId');
        const {id,Nameame} = req.user;
        const pathup = path.join(__dirname, '../uploads');
        const form = formidable({ multiples: false,uploadDir : pathup,allowEmptyFiles :false,keepExtensions :true });
        form.parse(req, async(err, fields, files) => {
            if (err) {
                console.log(err);
                return;
            }
            const fileName = `${gId}!File${req.user.id}!File${files.files.originalFilename}`;
            const rawdata = fs.readFileSync(files.files.filepath);
            const fileURL = await s3.uploadToS3(rawdata, fileName);
            const mesg = await Chat.create({
                message:fileURL,
                userId: id,
                groupId: gId
            });
            res.status(200).json({mesg,Name,success:true,fileName});
        });

    }catch(error){
        console.error(error);
        res.status(500).json({success:false,error:error.message});
    }
}