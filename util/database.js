const Sequelize=require('sequelize');
const dotenv=require('dotenv')
dotenv.config();
const sequelize=new Sequelize(process.env.SQL_NAME,process.env.SQL_ROOT,process.env.SQL_PASS,{
    dialect:'mysql',
    host:process.env.SQL_HOST
});
module.exports=sequelize;