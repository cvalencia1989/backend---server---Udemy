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
var usaurioRoutes = require('./routes/usuario');
var loginRoutes = require('./routes/login');

// conexion base datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) => {

    if (error) throw error
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});

// Rutas

app.use('/', appRoutes);
app.use('/usuario', usaurioRoutes);
app.use('/login', loginRoutes);

// escuchar peticiones

app.listen(3000, () => {
    console.log('express server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});