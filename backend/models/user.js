const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connect');

module.exports = User = sequelize.define('user', {
    id : {
        type : DataTypes.INTEGER,
        primaryKey : true,
        allowNull : false,
        autoIncrement : true
    },
    first_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    last_name : {
        type : DataTypes.STRING,
        allowNull : false
    },
    email : {
        type : DataTypes.STRING,
        allowNull : false,
        unique : true
    },
    phone : {
        type : DataTypes.STRING,
        allowNull : false
    },
    password : {
        type : DataTypes.STRING,
        allowNull : false
    },
    tokens : {
        type : DataTypes.JSON,
        defaultValue : ""
    }
});