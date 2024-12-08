const cors = require("cors")
const express = require("express")
const indexRoutes = require("./routes/routes")
const sequelize = require("./database/db")

const api = express()

const port = 3333

api.use(cors())

api.use(express.json())

api.use(express.text())

api.use(express.urlencoded({extended: true}))

api.use(indexRoutes())

api.listen(port, async () => {
    await sequelize.sync({force: false})
    console.log("server started");   
})
