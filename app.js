const express = require('express');
const cors = require('cors');
var app = express();

const rutaUsuarios = require('./src/routes/usuario.routes');
const rutaEmpresa = require('./src/routes/empresa.routes')

app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(cors());
app.use('/api', rutaUsuarios, rutaEmpresa);



module.exports = app;