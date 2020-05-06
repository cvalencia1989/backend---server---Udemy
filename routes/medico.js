// requires
var express = require('express');
var middelware = require('../middelwares/autenticacion');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// Inicializar variables
var app = express();


//==========================================
//Obtiene lista de medicos
//==========================================
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);


    Medico.find({})
        .limit(2)
        .skip(desde)
        .populate('usuario', 'nombre email')
        .populate('hospital')
        .exec((err, medicos) => {
            if (err) {
                return response.status(401).json({
                    mensaje: 'error cargando medicos',
                    ok: false,
                    errors: err
                });
            }

            Medico.count({}, (err, conteo) => {

                if (err) {
                    return response.status(401).json({
                        mensaje: 'error contato medico',
                        ok: false,
                        errors: err
                    });
                }

                return response.status(200).json({
                    medicos: medicos,
                    ok: true,
                    totalMedico: conteo
                });
            });
        });

});


//==========================================
//crea nuevo medico
//==========================================
app.post('/', middelware.verificacionToken, (request, response) => {

    var body = request.body;

    var medico = new Medico({
        nombre: body.nombre,
        img: body.img,
        usuario: request.userIdentity,
        hospital: body.hospital
    });

    medico.save((err, medicoGuardado) => {
        if (err) {
            return response.status(400).json({
                mensaje: 'error al crear medico',
                ok: false,
                errors: err
            });
        }

        return response.status(201).json({
            medico: medicoGuardado,
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

    Medico.findById(id, (err, medico) => {
        if (err) {
            return response.status(500).json({
                mensaje: 'error al buscar medico',
                ok: false,
                errors: err
            });
        }

        if (!medico) {
            return response.status(400).json({
                mensaje: 'medico con id: ' + id + ' no existe',
                ok: false,
                errors: { message: 'medico con id: ' + id + ' no existe' }
            });
        }

        medico.nombre = body.nombre;
        medico.img = body.img;
        medico.hospital = body.hospital;
        medico.usuario = request.userIdentity;

        medico.save((err, medicoGuardado) => {
            if (err) {
                return response.status(400).json({
                    mensaje: 'error al actualizar usaurio',
                    ok: false,
                    errors: err
                });
            }

            return response.status(201).json({
                medico: medicoGuardado,
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

    Medico.findByIdAndDelete(id, (err, medicoBorrado) => {
        if (err) {
            return response.status(500).json({
                mensaje: 'error al borrar medico',
                ok: false,
                errors: err
            });
        }

        if (!medicoBorrado) {
            return response.status(400).json({
                mensaje: 'medico con id: ' + id + ' no existe, por lo tanto no se pudo eliminar',
                ok: false,
                errors: { message: 'medico con id: ' + id + ' no existe, por lo tanto no se pudo eliminar' }
            });
        }

        return response.status(201).json({
            medico: medicoBorrado,
            ok: true,
        });


    });
});

module.exports = app;