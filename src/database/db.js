const { Sequelize } = require('sequelize');
const DATABASE_URL = "postgres://neondb_owner:zZ3Lra8xVgCS@ep-twilight-recipe-a45ag8fz-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require"

const sequelize = new Sequelize(DATABASE_URL,  {
    dialect: "postgres",
    host: "localhost",
    logging: false
})

module.exports = sequelize