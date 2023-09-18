const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const expressJwt = require('express-jwt')
const User = require('./user')

const signToken = (_id) => {
    return jwt.sign({_id}, 'mi-string-secreto')
}
//Shorter way of the previous function
//const signToken = _id => jwt.sign({_id}, 'mi-string-secreto')

const app = express()

app.use(express.json())

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

app.listen(3001, () =>{
    console.log('listening in port 3001')
})
