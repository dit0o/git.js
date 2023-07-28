const Sequelize = require('sequelize');

const sequelize = require('../util/database');

const User = sequelize.define('users', {
    id: {
        type: Sequelize.INTEGER,
        autoIncrement: true,
        allowNull: false,
        primaryKey: true
    },
    Name: {
        type: Sequelize.STRING,
        allowNull: false
    },
    Email: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true
    },
    PhoneNumber: {
        type: Sequelize.BIGINT,
        allowNull: false,
        unique: true
    },
    Password: {
        type: Sequelize.STRING,
        allowNull: false
    }
});

module.exports = User;