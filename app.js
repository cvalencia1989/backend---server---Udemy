// requires
var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

// Inicializar variables

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// importar rutas

var appRoutes = require('./routes/app');
var loginRoutes = require('./routes/login');
var usaurioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');

// conexion base datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) => {

    if (error) throw error
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});


//Server Index config

/*var serveIndex = require('serve-index');
app.use(express.static(__dirname + '/'))
app.use('/uploads', serveIndex(__dirname + '/uploads'));*/

// Rutas

app.use('/', appRoutes);
app.use('/login', loginRoutes);
app.use('/usuario', usaurioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/img', imagenesRoutes);

// escuchar peticiones

app.listen(3000, () => {
    console.log('express server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});