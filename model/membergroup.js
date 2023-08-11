const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const Groupmembers = sequelize.define('groupmembers', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    } 
});

module.exports = Groupmembers;