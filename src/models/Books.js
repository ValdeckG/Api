const sequelize = require("../database/db");

const {DataTypes} = require("sequelize")

const Books = sequelize.define("books", {
    title: {type: DataTypes.STRING, allowNull: false},
    author: {type: DataTypes.STRING, allowNull: false},
    gender: {type: DataTypes.STRING, allowNull: false},
    year: {type: DataTypes.DATE, allowNull: false},
    is_lending: {type: DataTypes.BOOLEAN, allowNull: false, defaultValue: false} 
})

module.exports = Books