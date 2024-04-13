const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connect');

module.exports = ArchivedMessage = sequelize.define('archived_message', {
    id : {
        type : DataTypes.INTEGER,
        allowNull : false,
        autoIncrement : true,
        primaryKey : true
    },
    content : {
        type : DataTypes.JSON,
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