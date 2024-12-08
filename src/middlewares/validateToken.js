const jwt = require("jsonwebtoken")
const validateToken = (req, res, next) => {
    try {
        const secret = "23gfq4H89hy989Y_*&tg7*GB*&dh(DH8*&gf*¨F*fd0DGBd87"
        const authHeader = req.headers["authorization"] 
        const token = authHeader && authHeader.split(" ")[1]
        if (!token) return res.status(401).json({
            message: "acesso negado"

        })

        const verifiedToken = jwt.verify(token, secret)
        req.connectedUser = verifiedToken
        next()

    } catch (error) {
        return res.status(403).json({
            message: "token invalido"
        })
    }
}

module.exports = validateToken