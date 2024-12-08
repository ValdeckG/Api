const sequelize = require("../database/db");
const Books = require("./Books");
const Users = require("./Users");
const { DataTypes } = require("sequelize");

const BooksManagement = sequelize.define("books_management", {
  management_date: { type: DataTypes.DATE, allowNull: false },
  return_date: { type: DataTypes.DATE, allowNull: true, defaultValue: null },
  is_returned: {
    type: DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false,
  },
  type: { type: DataTypes.STRING, allowNull: false },
  lendingid: { type: DataTypes.INTEGER, allowNull: true },
  devolution_date: { type: DataTypes.DATE, allowNull: true },
});

BooksManagement.belongsTo(Books);
BooksManagement.belongsTo(Users);
// BooksManagement.belongsTo(BooksManagement);

module.exports = BooksManagement;
