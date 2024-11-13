const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connect');

module.exports = Message = sequelize.define('message', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    content : {
        type : DataTypes.TEXT,
        allowNull : true
    },
    sender : {
        type : DataTypes.STRING,
        allowNull : false
    },
    isAttachment : {
        type : DataTypes.BOOLEAN,
        allowNull : false,
        defaultValue : false
    }
});