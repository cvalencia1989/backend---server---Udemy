// requires
var express = require('express');
var middelware = require('../middelwares/autenticacion');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');

// Inicializar variables
var app = express();


//==========================================
//Obtiene lista de hospitales
//==========================================
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .limit(2)
        .skip(desde)
        .populate('usuario', 'nombre email')
        .exec((err, hospitales) => {
            if (err) {
                return response.status(401).json({
                    mensaje: 'error cargando hospitales',
                    ok: false,
                    errors: err
                });
            }

            Hospital.count({}, (err, conteo) => {

                if (err) {
                    return response.status(401).json({
                        mensaje: 'error contato hospital',
                        ok: false,
                        errors: err
                    });
                }

                return response.status(200).json({
                    hospitales: hospitales,
                    ok: true,
                    totalHospital: conteo
                });
            });
        });

});


//==========================================
//crea nuevo hospital
//==========================================
app.post('/', middelware.verificacionToken, (request, response) => {

    var body = request.body;

    var hospital = new Hospital({
        nombre: body.nombre,
        img: body.img,
        usuario: request.userIdentity
    });

    hospital.save((err, hospitalGuardado) => {
        if (err) {
            return response.status(400).json({
                mensaje: 'error al crear hospital',
                ok: false,
                errors: err
            });
        }

        return response.status(201).json({
            hospital: hospitalGuardado,
            usuarioToken: request.usuario,
            ok: true,
        });

    });

});

//==========================================
//actualiazr nuevo hospital
//==========================================
app.put('/:id', middelware.verificacionToken, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Hospital.findById(id, (err, hospital) => {
        if (err) {
            return response.status(500).json({
                mensaje: 'error al buscar hospital',
                ok: false,
                errors: err
            });
        }

        if (!hospital) {
            return response.status(400).json({
                mensaje: 'hospital con id: ' + id + ' no existe',
                ok: false,
                errors: { message: 'hospital con id: ' + id + ' no existe' }
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = request.userIdentity;

        hospital.save((err, hospitalGuardado) => {
            if (err) {
                return response.status(400).json({
                    mensaje: 'error al actualizar usaurio',
                    ok: false,
                    errors: err
                });
            }

            return response.status(201).json({
                hospital: hospitalGuardado,
                ok: true,
            });

        });
    });
});

//==========================================
//borrar un hospital
//==========================================
app.delete('/:id', middelware.verificacionToken, (request, response) => {

    var id = request.params.id;

    Hospital.findByIdAndDelete(id, (err, hospitalBorrado) => {
        if (err) {
            return response.status(500).json({
                mensaje: 'error al borrar hospital',
                ok: false,
                errors: err
            });
        }

        if (!hospitalBorrado) {
            return response.status(400).json({
                mensaje: 'hospital con id: ' + id + ' no existe, por lo tanto no se pudo eliminar',
                ok: false,
                errors: { message: 'hospital con id: ' + id + ' no existe, por lo tanto no se pudo eliminar' }
            });
        }

        return response.status(201).json({
            hospital: hospitalBorrado,
            ok: true,
        });


    });
});

module.exports = app;