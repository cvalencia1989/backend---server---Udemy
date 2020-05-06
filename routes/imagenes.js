// requires
var express = require('express');

// Inicializar variables
var app = express();

var path = require('path');
var fs = require('fs');

//rutas
app.get('/:tipo/:imagen', (request, response, next) => {
    var coleccion = request.params.tipo;
    var idImagen = request.params.imagen;
    //tipos coleccion 
    var coleccionesValidas = ['usuarios', 'medicos', 'hospitales'];

    if (coleccionesValidas.indexOf(coleccion) < 0) {
        return response.status(404).json({
            mensage: 'coleccion no valida',
            ok: false
        });
    }

    pathImagen = path.resolve(__dirname, `../uploads/${coleccion}/${idImagen}`);
    //tipos coleccion 
    if (fs.existsSync(pathImagen)) {

        response.sendFile(pathImagen);
    } else {
        var pathNoIamge = path.resolve(__dirname, `../assets/no-img.jpg`);
        response.sendFile(pathNoIamge);
    }

});

module.exports = app;