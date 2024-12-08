const {Router} = require("express")
const usersController = require("../controller/usersController")
const router = Router()
const usersRoutes = () => {
    router.post("/user/register", usersController.register)
    router.post("/user/login", usersController.login)
    router.get("/users", usersController.getAll)
    
    return router
}

module.exports = usersRoutes