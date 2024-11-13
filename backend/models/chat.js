const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connect');

module.exports = Chat = sequelize.define('chat', {
    id : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true,
        unique : true
    },
    isGroup : {
        type : DataTypes.BOOLEAN,
        defaultValue : false,
        allowNull : false
    },
    group_name : {
        type : DataTypes.STRING,
        allowNull : true
    },
    group_description : {
        type : DataTypes.STRING,
        allowNull : true
    },
    total_members : {
        type : DataTypes.INTEGER,
        allowNull : true,
        defaultValue : 1
    },
    admins : {
        type : DataTypes.TEXT,
        allowNull : true
    }
});