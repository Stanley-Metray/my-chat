const { DataTypes } = require('sequelize');
const sequelize = require('../connection/connect');

module.exports = JoinLink = sequelize.define('join_link', {
    id : {
        type : DataTypes.STRING,
        allowNull : false,
        primaryKey : true
    },
    link : {
        type : DataTypes.STRING,
        allowNull : false
    }
}); 