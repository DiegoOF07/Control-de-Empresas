const Empleado = require('../models/empleados.model')
const pdf=require('../pdf/pdf')
const excel=require('../excel/excel')

function agregarEmpleados(req, res) {
    var empleadoModel = new Empleado();
    var parametros = req.body;
    if (req.user.rol == 'EMPRESA') {
        if (parametros.nombre &&
            parametros.puesto && parametros.departamento) {
            empleadoModel.nombre = parametros.nombre;
            empleadoModel.apellido = parametros.apellido;
            empleadoModel.puesto = parametros.puesto;
            empleadoModel.departamento = parametros.departamento;
            empleadoModel.idEmpresa = req.user.sub;
            empleadoModel.save((err, empleadoGuardado) => {
                if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                if (!empleadoGuardado) return res.status(500).send({ mensaje: "Error al guardar el empleado" })

                return res.status(200).send({ empleado: empleadoGuardado })
            })
        }else{
            res.status(500).send({ mensaje: 'Llene todos los campos' })
        }

    } else {
        res.status(500).send({ mensaje: 'Solo la empresa puede crear empleados' })
    }
}

function editarEmpleados(req, res){
    var idEmpleado=req.params.idEmpleado;
    var parametros=req.body;
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub, _id: idEmpleado} ,(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "El id ingresado no es valido"})
            if(empleadosEncontrados){
                Empleado.findByIdAndUpdate(idEmpleado,parametros, {new: true}, (err,empleadosActualizados)=>{
                    if(err) return res.status(500).send({ mensaje: "Error en la peticion"})
                    if(!empleadosActualizados) return res.status(500).send({ mensaje: "Error, no se pudo editar el empleado"})

                    return res.status(200).send({ empleado: empleadosActualizados})
                })
            }else{
                res.status(500).send({ mensaje: 'El empleado que usted desea editar no existe o no pertenece a esta empresa'})
            }
        })
    }else{
        res.status(500).send({ mensaje: 'Solo la empresa puede editar empleados'})
    }
}


function eliminarEmpleados(req, res){
    var idEmpleado=req.params.idEmpleados;
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub, _id: idEmpleado}, (err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje:"El id  no es valido"})
            if(empleadosEncontrados){
                Empleado.findByIdAndDelete(idEmpleado, (err, empleadoEliminado)=>{
                    if(err) return res.status(500).send({ mensaje: "Error en la peticion"})
                    if(!empleadoEliminado) return res.status(500).send({ mensaje: "Error, no se pudo eliminar el empleado"})

                    return res.status(200).send({ empleado: empleadoEliminado})
                })
            }else{
                res.status(500).send({ mensaje: 'El empleado que usted desea eliminar no existe o no pertenece a esta empresa'})
            }
        })
    }else{
        res.status(500).send({ mensaje: 'Solo la empresa puede eliminar empleados'})
    }
}

function contarCantidadEmpleados(req,res) {
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub},(err, empleadosEncontrados)=>{
            var cantidadEmpleados=empleadosEncontrados.length;

            return res.status(200).send({empleados: cantidadEmpleados})
        })
    }
}

function buscarEmpleadosPorId(req, res){
    var idEmpleado=req.params.id
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub, _id:idEmpleado},(err,empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "El id que ha introducido no es valido"})
            if(empleadosEncontrados.length==0) return res.status(500).send({ mensaje: "Error, el empleado que busca no existe o no pertenece a esta empresa"})

            return res.status(200).send({empleado: empleadosEncontrados})
        })
    }else{
        res.status(500).send({ mensaje: 'Solo la empresa puede buscar a sus empleados'})
    }
}

function buscarEmpleadosPorNombre(req, res){
    var nombreEmpleado=req.params.nombre;
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub, nombre: nombreEmpleado},(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "Hubo un error en la peticion del empleado"})
            if(empleadosEncontrados.length==0) return res.status(500).send({ mensaje: "El empleado que busca no existe o no pertenece a su empresa"})

            return res.status(200).send({empleado: empleadosEncontrados})  
        })
    }else{
        res.status(500).send({ mensaje: 'Solo la empresa puede buscar a sus empleados'})
    }
}

function buscarEmpleadosPorPuesto(req, res){
    var puesto=req.params.puesto;
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub, puesto: puesto},(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "Hubo un error en la peticion del empleado"})
            if(empleadosEncontrados.length==0) return res.status(500).send({ mensaje: "El empleado que busca no existe o no pertenece a su empresa"})

            return res.status(200).send({empleado: empleadosEncontrados})
        })
    }else{
        res.status(500).send({ mensaje: 'Solo la empresa puede buscar a sus empleados'}) 
    }
}

function buscarEmpleadosPorDepartamento(req, res){
    var departamento=req.params.departamento;
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub, departamento: departamento},(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "Hubo un error en la peticion del empleado"})
            if(empleadosEncontrados.length==0) return res.status(500).send({ mensaje: "El empleado que busca no existe o no pertenece a su empresa"})

            return res.status(200).send({empleado: empleadosEncontrados})
        })
    }else{
        res.status(500).send({ mensaje: 'Solo la empresa puede buscar a sus empleados'}) 
    }
}

function buscarTodosLosEmpleados(req, res) {
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub},(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "Hubo un error en la peticion de los empleados"})
            if(empleadosEncontrados.length==0)  return res.status(500).send({ mensaje: "La empresa no posee empleados actualmente"})

            return res.status(200).send({empleados: empleadosEncontrados})
        })
    }
}

function imprimirPDF(req, res) {
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub},(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "Hubo un error en la peticion de los empleados"})
            if(empleadosEncontrados.length==0)  return res.status(500).send({ mensaje: "La empresa no posee empleados actualmente"})

            pdf.crearPDF(empleadosEncontrados, req.user.nombre);
            return res.status(200).send({mensaje: "El PDF se ha creado"})
        })
    }
}

function imprimirExcel(req, res) {
    if(req.user.rol=='EMPRESA'){
        Empleado.find({idEmpresa: req.user.sub},(err, empleadosEncontrados)=>{
            if(err) return res.status(500).send({ mensaje: "Hubo un error en la peticion de los empleados"})
            if(empleadosEncontrados.length==0)  return res.status(500).send({ mensaje: "La empresa no posee empleados actualmente"})

            excel.crearExcel(empleadosEncontrados, req.user.nombre);
            return res.status(200).send({mensaje: "El excel se ha creado"})
        }) 
    }
}

module.exports = {
    agregarEmpleados,
    editarEmpleados,
    eliminarEmpleados,
    contarCantidadEmpleados,
    buscarEmpleadosPorId,
    buscarEmpleadosPorNombre,
    buscarEmpleadosPorPuesto,
    buscarEmpleadosPorDepartamento,
    buscarTodosLosEmpleados,
    imprimirPDF,
    imprimirExcel
}