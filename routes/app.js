// requires
var express = require('express');

// Inicializar variables
var app = express();

//rutas
app.get('/', (request, response, next) => {

    response.status(200).json({
        mensaje: 'Peticion realizada correctamente',
        ok: true
    });
});

module.exports = app;