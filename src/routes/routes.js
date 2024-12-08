const {Router} = require("express")
const usersRoutes = require("./usersRoute")
const booksRoutes = require("./booksRoute")
const booksManagementRoutes = require("./booksManagementRoute")
const router = Router()

const indexRoutes = () => {
    router.use("/api" ,usersRoutes())
    router.use("/api" ,booksRoutes())
    router.use("/api" ,booksManagementRoutes())

    return router
}

module.exports = indexRoutes