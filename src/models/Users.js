const sequelize = require("../database/db");

const {DataTypes} = require("sequelize")

const Users = sequelize.define("users", {
    name: {type: DataTypes.STRING, allowNull: false},
    address: {type: DataTypes.STRING, allowNull: false},
    email: {type: DataTypes.STRING, allowNull: false},
    phone_number: {type: DataTypes.STRING, allowNull: false},
    password: {type: DataTypes.STRING, allowNull: false},
    lending_count: {type: DataTypes.INTEGER, allowNull: false, defaultValue: 0}
})

module.exports = Users