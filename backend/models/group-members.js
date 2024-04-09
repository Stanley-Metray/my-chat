const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connect');

module.exports = GroupMembers = sequelize.define('group_members', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    user_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    userId : {
        type : DataTypes.INTEGER,
        allowNull : false
    },
    chatId : {
        type : DataTypes.STRING,
        allowNull : false
    },
    isAdmin : {
        type : DataTypes.BOOLEAN,
        defaultValue : false
    }
});