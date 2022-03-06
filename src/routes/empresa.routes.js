const express = require('express');
const empresaControlador = require('../controllers/empresa.controller');
const md_autenticacion = require('../middlewares/autenticacion');

const api = express.Router();

api.post('/agregarEmpleados', md_autenticacion.Auth, empresaControlador.agregarEmpleados);
api.put('/editarEmpleados/:idEmpleado', md_autenticacion.Auth, empresaControlador.editarEmpleados);
api.delete('/eliminarEmpleados/:idEmpleados', md_autenticacion.Auth, empresaControlador.eliminarEmpleados);
api.get('/cantidadEmpleados', md_autenticacion.Auth, empresaControlador.contarCantidadEmpleados);
api.get('/empleadoPorId/:id', md_autenticacion.Auth, empresaControlador.buscarEmpleadosPorId);
api.get('/empleadoPorNombre/:nombre', md_autenticacion.Auth, empresaControlador.buscarEmpleadosPorNombre);
api.get('/empleadoPorPuesto/:puesto', md_autenticacion.Auth, empresaControlador.buscarEmpleadosPorPuesto);
api.get('/empleadoPorDepartamento/:departamento', md_autenticacion.Auth, empresaControlador.buscarEmpleadosPorDepartamento);
api.get('/empleados', md_autenticacion.Auth, empresaControlador.buscarTodosLosEmpleados);
api.get('/imprimirEmpleados', md_autenticacion.Auth, empresaControlador.imprimirPDF);
api.get('/empleadosExcel', md_autenticacion.Auth, empresaControlador.imprimirExcel);


module.exports = api;