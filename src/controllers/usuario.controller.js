const Usuario = require('../models/usuario.model')
const Empleado = require('../models/empleados.model')
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');


function creacionAdmin() {
    var usuarioModel = new Usuario();
    Usuario.find({ user: 'Admin' }, (err, usuarioEncontrado) => {

        if (usuarioEncontrado.length === 0) {

            usuarioModel.user = 'Admin';
            usuarioModel.nombre = 'Administrador por Defecto';
            usuarioModel.rol = 'ADMIN';

            bcrypt.hash('123456', null, null, (err, passwordEncriptada) => {
                usuarioModel.password = passwordEncriptada;

                usuarioModel.save(() => {
                    console.log("Usuario por defecto creado con exito")
                });

            });
        } else {
            console.log("El administrador ya existe")
        }
    })
}

function Login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ user: parametros.user }, (err, usuarioEncontrado) => {
        if (err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if (usuarioEncontrado) {
            bcrypt.compare(parametros.password, usuarioEncontrado.password,
                (err, verificacionPassword) => {
                    if (verificacionPassword) {
                        if (parametros.obtenerToken === 'true') {
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return res.status(200)
                                .send({ usuario: "Parametro faltante" })
                        }

                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las clave no coincide' });
                    }
                })
        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el usuario no se encuentra registrado.' })
        }
    })
}

function agregarEmpresas(req, res) {
    var usuarioModel = new Usuario();
    var parametros = req.body;
    if (req.user.rol === 'ADMIN') {
        Usuario.find({ user: parametros.user }, (err, usuarioEncontrado) => {
            if (usuarioEncontrado.length === 0) {
                usuarioModel.user = parametros.user;
                usuarioModel.nombre = parametros.nombre;
                usuarioModel.rol = 'EMPRESA';
                bcrypt.hash(parametros.password, null, null, (err, passwordEncriptada) => {
                    usuarioModel.password = passwordEncriptada;
                    usuarioModel.save((err, usuarioGuardado) => {
                        if (err) return res.status(500)
                            .send({ mensaje: 'Error en la peticion' });
                        if (!usuarioGuardado) return res.status(500)
                            .send({ mensaje: 'Error al agregar el Usuario' });

                        return res.status(200).send({ empresa: usuarioGuardado });
                    });

                });

            } else {
                res.status(500).send({ mensaje: "La empresa que desesa agregar ya existe" })
            }
        })
    } else {
        res.status(500).send({ mensaje: "Unicamente el administrador puede agregar empresas" })
    }
}

function editarEmpresas(req, res) {
    var parametros = req.body;
    var idEmpresa = req.params.idEmpresa;
    if (req.user.rol == 'ADMIN') {
        Usuario.findByIdAndUpdate(idEmpresa, parametros, { new: true }, (err, usuarioActualizado) => {
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
            if (!usuarioActualizado) return res.status(500).send({ mensaje: "Error, no se pudo actualizar la empresa" })

            return res.status(200).send({ empresa: usuarioActualizado })
        })
    } else {
        res.status(500).send({ mensaje: "Unicamente el administrador puede editar empresas" })
    }
}

function eliminarEmpresas(req, res) {
    var idEmpresa=req.params.idEmpresas;
    if(req.user.rol=="ADMIN"){
        Usuario.findByIdAndDelete(idEmpresa,(err,empresaEliminada)=>{
            if(err) return res.status(500).send({ mensaje: "Error en la peticion"})
            if(!empresaEliminada) return res.status(500).send({mensaje: "Error, no se pudo eliminar la empresa"})
            Empleado.find({idEmpresa: empresaEliminada._id},(err, empleadosEncontrados)=>{
                Empleado.deleteMany({idEmpresa: empresaEliminada._id}, (err, empleadosEliminados)=>{
                    if(err) return res.status(500).send({ mensaje: "Error en la peticion"})
                    if(empleadosEliminados.length==0) return res.status(500).send({mensaje: "La empresa no tenia empleados que eliminar"})
                })    
            })
            return res.status(200).send({ empresa: empresaEliminada})
        })
    } else {
        res.status(500).send({ mensaje: "Unicamente el administrador puede eliminar empresas" })
    }
}

module.exports = {
    creacionAdmin,
    Login,
    agregarEmpresas,
    editarEmpresas,
    eliminarEmpresas
}
