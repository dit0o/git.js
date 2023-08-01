const Chat=require('../model/chat')
exports.postMsg=async(req,res,next)=>{
    try {
        const{id,Name}=req.user;
        const message=req.body.message;
        const mesg = await Chat.create( {message, userId:id});
        res.status(200).json({mesg, Name});
        
    } catch (error) {
        res.status(500).json({error,success: false}); 
    }
   
}
exports.getMessage = async (req,res,next)=>{
    try{
    const {id, Name} = req.user;

    const mesg = await Chat.findAll({where: {userId:id}});
    res.status(200).json({mesg, Name});
    } catch(error) {
        console.log(error);
        res.status(500).json({error,success: false});
    }
}