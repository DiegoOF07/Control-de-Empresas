const mongoose = require('mongoose')
const Schema =mongoose.Schema

const usuarioSchema = Schema({
    user: String,
    nombre: String,
    password: String,
    rol: String
})

module.exports =mongoose.model('Usuarios', usuarioSchema)