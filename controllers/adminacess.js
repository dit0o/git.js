const Chat = require('../model/chat')
const User = require('../model/user')
const Group = require('../model/group')
const Groupmembers = require('../model/membergroup')
exports.getAddUser = async (req, res, next) => {
    try {
        const by = req.query.by;
        const value = req.query.value;
        const gId = req.query.gId;
        const { id } = req.user;
        const isAdm = await Groupmembers.findOne({ where: { userId: id }, attributes: ['isAdmin'] });
        if (!isAdm.dataValues.isAdmin) {
            return res.status(401).json({ success: false, error: 'Is not admin' });
        }
        console.log(by, value);
        let userDetails = null;
        if (by == 'Name') {
            userDetails = await User.findOne({ where: { Name: value }, attributes: ['id'] });
        } else if (by == 'Email') {
            userDetails = await User.findOne({ where: { Email: value }, attributes: ['id'] });
        } else if (by == 'PhoneNumber') {
            userDetails = await User.findOne({ where: { PhoneNumber: value }, attributes: ['id'] });
        }

        const uId = userDetails.dataValues.id;
        const groupmem = await Groupmembers.create({ userId: uId, groupId: gId, isAdmin: false });
        res.status(201).json({ groupmem, success: true });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: error, success: false });
    }
}
exports.getAllU = async (req, res, next) => {
    try {
        const gId = req.query.gId;
        const allUsers = await Groupmembers.findAll({
            where: { groupId: gId },
            attributes: ['userId', 'isAdmin'],
            include: [{
                model: User,
                attributes: ['Name']
            }],

        });
        const uId = req.user.id;
        const reqUserAdmin = await Groupmembers.findOne({
            where: { userId: uId, groupId: gId },
            attributes: ['isAdmin']
        });
        res.status(200).json({ allUsers, reqUserAdmin, success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ success: false, error });
    }
}
exports.getRemU = async (req, res, next) => {

    try {
         const uId = req.query.id;
          const gId = req.query.gId;
           const remU = await Groupmembers.destroy({
             where: { groupId: gId, userId: uId }

        });
         res.status(200).json({ removed: remU, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error, success: false });

    }

}

exports.getMakeA = async (req, res, next) => {

    try {
        const uId = req.query.id;
        const gId = req.query.gId;
        const isAdmi = await Groupmembers.update({ isAdmin: true }, {
            where: { groupId: gId, userId: uId }

        })
        res.status(200).json({ admin: isAdmi, success: true });

    } catch (error) {
        console.log(error);
        res.status(500).json({ error, success: false });

    }

}