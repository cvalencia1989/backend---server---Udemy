// requires
var express = require('express');
var fileUpload = require('express-fileupload');
var express = require('express');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');
var fs = require('fs');

// Inicializar variables
var app = express();
app.use(fileUpload());

//rutas
app.put('/:tabla/:idColeccion', (request, response, next) => {
    var idColeccion = request.params.idColeccion;
    var coleccion = request.params.tabla;

    if (!request.files) {
        return response.status(404).json({
            mensage: 'no viene imagen',
            ok: false
        });
    } else {



        var archivo = request.files.imagen;
        var nombreFile = archivo.name.split('.');
        var extencionArchivo = nombreFile[nombreFile.length - 1];

        //tipos validos
        var extencionesValidas = ['png', 'jpg'];

        if (extencionesValidas.indexOf(extencionArchivo) < 0) {
            return response.status(404).json({
                mensage: 'extencion no valida',
                ok: false
            });
        }

        //tipos coleccion 

        var coleccionesValidas = ['usuarios', 'medicos', 'hospitales'];

        if (coleccionesValidas.indexOf(coleccion) < 0) {
            return response.status(404).json({
                mensage: 'coleccion no valida',
                ok: false
            });
        }



        //tranformar nombre archivo
        var nombreArchico = `${idColeccion} - ${ new Date().getMilliseconds()}.${extencionArchivo}`;
        var path = `./uploads/${coleccion}/${nombreArchico}`;

        archivo.mv(path, err => {
            if (err) {
                return response.status(500).json({
                    mensage: 'error al mover archivo',
                    ok: false
                });
            } else {
                subirPortipo(coleccion, idColeccion, nombreArchico, response);
            }
        });





    }
});


function subirPortipo(tipo, id, path, response) {
    switch (tipo) {
        case 'usuarios':
            Usuario.findById(id, (error, usuario) => {
                var pathViejo = `./uploads/${tipo}/${usuario.img}`;
                console.log(pathViejo)
                if (fs.existsSync(pathViejo)) {
                    console.log(pathViejo);
                    fs.unlinkSync(pathViejo);
                }

                usuario.img = path;
                usuario.save((error, usuarioActualizado) => {

                    return response.status(200).json({
                        mensaje: 'Usuario Actualizado',
                        [tipo]: usuarioActualizado,
                        ok: true
                    });
                });
            });
            break;
        case 'medicos':
            Medico.findById(id, (error, medico) => {
                var pathViejo = `./uploads/${tipo}/${medico.img}`;
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                medico.img = path;
                medico.save((error, medicoActualizado) => {
                    return response.status(200).json({
                        mensaje: 'Medico Actualizado',
                        [tipo]: medicoActualizado,
                        ok: true
                    });
                });
            });
            break;
        case 'hospitales':
            Hospital.findById(id, (error, hospital) => {
                var pathViejo = `./uploads/${tipo}/${hospital.img}`;
                if (fs.existsSync(pathViejo)) {
                    fs.unlinkSync(pathViejo);
                }

                hospital.img = path;
                hospital.save((error, hospitalActualizado) => {
                    return response.status(200).json({
                        mensaje: 'Hospital Actualizado',
                        [tipo]: hospitalActualizado,
                        ok: true
                    });
                });
            });
            break;
    }
}


module.exports = app;