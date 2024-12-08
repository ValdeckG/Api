const {Router} = require("express")
const booksController = require("../controller/booksController")
const validateToken = require("../middlewares/validateToken")
const router = Router()

const booksRoutes = () => {
    router.post("/book", validateToken, booksController.create)
    router.get("/books", validateToken, booksController.getAll)
    router.put("/book/:id", validateToken, booksController.update)
    router.delete("/book/:id", validateToken, booksController.destroy)
    
    return router
}

module.exports = booksRoutes