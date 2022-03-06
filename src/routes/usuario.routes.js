const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/login', usuarioControlador.Login);
api.post('/agregarEmpresas', md_autenticacion.Auth, usuarioControlador.agregarEmpresas);
api.put('/editarEmpresas/:idEmpresa', md_autenticacion.Auth, usuarioControlador.editarEmpresas);
api.delete('/eliminarEmpresas/:idEmpresas', md_autenticacion.Auth, usuarioControlador.eliminarEmpresas);


module.exports = api;