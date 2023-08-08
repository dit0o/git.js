const Chat=require('../model/chat')
const User=require('../model/user')
exports.postMsg=async(req,res,next)=>{
    try {
        const{id}=req.user;
        const message=req.body.message;
        const mesg = await Chat.create( {message, userId:id});
        res.status(200).json({mesg, Name});
        
    } catch (error) {
        res.status(500).json({error,success: false}); 
    }
   
}
exports.getMessage = async (req,res,next)=>{
    try{
     
        const lastId=+req.query.lastId || 0;
        console.log(lastId)
    let mesg = await Chat.findAll({offset:lastId ,include:[
{
    model:User,
    attributes: ['id', 'Name']

}
]});
    res.status(200).json({mesg});
    } catch(error) {
        console.log(error);
        res.status(500).json({error,success: false});
    }
}