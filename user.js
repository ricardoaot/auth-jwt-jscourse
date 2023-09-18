const mongoose = require('mongoose')

//mongoose.connect('mongodb+srv://ricardoaot:qhDAwZQ1RAUFzWkF@cluster.pw2eeja.mongodb.net/?retryWrites=true&w=majority')
mongoose.connect('mongodb+srv://ricardoaot:qhDAwZQ1RAUFzWkF@cluster.pw2eeja.mongodb.net/auth?retryWrites=true&w=majority')

const User = mongoose.model('User', {
    email:{
        type: String,
        required: true
    },
    password:{
        type: String,
        required: true
    },
    salt:{
        type: String,
        required: true
    },
})

module.exports = User