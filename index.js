const mongoose = require('mongoose');
const app = require('./app');
const usuarioControlador= require('./src/controllers/usuario.controller')

mongoose.Promise = global.Promise;                                                                
mongoose.connect('mongodb://localhost:27017/ControlEmpresas', { useNewUrlParser: true, useUnifiedTopology: true }).then(()=>{
    console.log("Conexion a la base de datos exitosa");
    app.listen(3000, () => {
        usuarioControlador.creacionAdmin();
        console.log("Aplicacion en el puerto 3000")
    })
    
}).catch(error => console.log(error)); 