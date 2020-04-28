// requires
var express = require('express');
var mongoose = require('mongoose');

// Inicializar variables
var app = express();


// conexion base datos

mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', (error, res) => {

    if (error) throw error
    console.log('Base de Datos: \x1b[32m%s\x1b[0m', 'online');
});

//rutas
app.get('/', (request, response, next) => {

    response.status(200).json({
        mensaje: 'Peticion realizada correctamente',
        ok: true
    });
});

// escuchar peticiones

app.listen(3000, () => {
    console.log('express server corriendo en puerto 3000: \x1b[32m%s\x1b[0m', 'online');
});