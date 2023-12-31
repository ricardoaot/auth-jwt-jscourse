const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const { expressjwt } = require("express-jwt");
const User = require('./user')

const app = express()
app.use(express.json())

//console.log(process.env.SECRET)

const validateJwt = expressjwt({ secret: 'mi-string-secreto', algorithms: ['HS256'] })

const signToken = (_id) => {
    return jwt.sign({_id}, 'mi-string-secreto')
}
//Shorter way of the previous function
//const signToken = _id => jwt.sign({_id}, 'mi-string-secreto')


app.post('/register', async (req, res) => {
    const {body} = req
    console.log({body})

    try {
        const isUser = await User.findOne({ email: body.email})
        if(isUser){
            return res.status(403).send('Usuario ya existe')
        }

        const salt = await bcrypt.genSalt()
        const hashed = await bcrypt.hash(body.password, salt)
        const user = await User.create({
            email:body.email,
            password:hashed,
            salt:salt
        })

        const signed = signToken(user._id)
        res.status(201).send(signed)
        //res.send({ _id: user._id})
    }catch(err){
        console.log(err)
        res.status(500).send(err.message)
    }
})


app.post('/login', async (req, res) =>{
    const { body } = req

    try{
        const user = await User.findOne({email: body.email})
        if(!user){
            res.status(403).send('usuario y/o contraseña invalida')
        }else{
            const isMatch = await bcrypt.compare(body.password, user.password)
            if (isMatch){
                const signed = signToken(user._id)
                res.status(200).send(signed)
            }else{
                res.status(403).send('usuario y/o contraseña invalida')
            }
        }
    } 
    catch(err) {
        res.status(500).send(err.message)
    }
})

const findAndAssignUser = async (req,res,next) => {
    try {
        const user = await User.findById(req.auth._id)

        if ( !user ) {
            return res.status(401).end()
        }
        req.user = user
        next()

    } catch (e) {
        next(e)
    }
}

const isAuthenticated = express.Router().use(validateJwt, findAndAssignUser)

app.get(
    '/lele', 
    isAuthenticated,
    (req, res) => {
        return res.send(req.user)
    }
)

app.listen(3001, () =>{
    console.log('listening in port 3001')
})
