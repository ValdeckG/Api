const Users = require("../models/Users")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
    const {name, address, email, phone_number, password, confirmPassword} = req.body
try {
    if (password !== confirmPassword) {
        throw new Error("Senhas não correspondem")
    }
    
    const userExist = await Users.findOne({where: {email}})

    if (userExist) {
        throw new Error("email ja cadastrado")
    }

    const salt = await bcrypt.genSalt(12)
    const hash = await bcrypt.hash(password, salt)
    const register = await Users.create({
        name,
        address,
        email,
        phone_number,
        password: hash
    },{
        raw: true
    })
    
    register["password"] = undefined
    return res.status(201).json({
        message: "usuario registrado com sucesso", 
        data: {
            ...register.dataValues,
        }
    })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message 
        })
    }
}

const login = async (req, res) => {
    const {email,password} = req.body
try {
    const secret = "23gfq4H89hy989Y_*&tg7*GB*&dh(DH8*&gf*¨F*fd0DGBd87"
    const userExist = await Users.findOne({where: {email}})

    if (!userExist) {
        throw new Error("email não cadastrado")
    }
    
    const checkPassword = await bcrypt.compare(password, userExist.password)
    if (!checkPassword) {
        throw new Error("senha invalida")
    }

    const token = jwt.sign(
        {
            id: userExist.id
        }, 
        secret,
        {
            expiresIn: "15d"
        }
    )


    return res.status(200).json({
        message: "token gerado com sucesso", 
        token
    })
        
    } catch (error) {
        return res.status(500).json({
            message: error.message 
        })
    }
}

const getAll = async (req, res) => {

    try {
        const getAll = await Users.findAll({
            raw: true,
            attributes: {
                exclude: ["password"]
            }
        })

        return res.status(200).json({   
            data: getAll
        })
            
        } catch (error) {
            return res.status(500).json({
                message: error.message 
            })
        }
    }
    

module.exports = {
    register,
    login,
    getAll
}