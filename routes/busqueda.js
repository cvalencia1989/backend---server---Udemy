// requires
var express = require('express');
var Usuario = require('../models/usuario');
var Hospital = require('../models/hospital');
var Medico = require('../models/medico');

// Inicializar variables
var app = express();

//rutas

//==========================================
//busqueda especifica
//==========================================
app.get('/coleccion/:tabla/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda;
    var coleccion = request.params.tabla;
    var regex = new RegExp(busqueda, 'i');
    var promesa;

    switch (coleccion) {
        case 'hospital':
            promesa = buscarHospitales(busqueda, regex);
            break;
        case 'medico':

            promesa = buscarMedicos(busqueda, regex);
            break;

        case 'Usuario':

            promesa = buscarUsuarios(busqueda, regex);
            break;

        default:


            return response.status(404).json({
                mensage: 'coleccion ingresada no existe',
                ok: false
            });
            break;
    }

    promesa.then(data => {
        return response.status(200).json({
            [coleccion]: data,
            ok: true
        });
    });
});


//==========================================
//busqueda general
//==========================================
app.get('/todo/:busqueda', (request, response, next) => {

    var busqueda = request.params.busqueda;
    var regex = new RegExp(busqueda, 'i')

    Promise.all([
            buscarHospitales(busqueda, regex), buscarMedicos(busqueda, regex), buscarUsuarios(busqueda, regex)
        ])
        .then(respuestas => {

            return response.status(200).json({
                hospitales: respuestas[0],
                medicos: respuestas[1],
                usuarios: respuestas[2],
                ok: true
            });
        });

});


function buscarHospitales(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Hospital.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .exec((err, hospitales) => {
                if (err) {
                    reject('error cargar hospitales', err);
                } else {

                    resolve(hospitales);
                }
            });

    });
}

function buscarMedicos(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Medico.find({ nombre: regex })
            .populate('usuario', 'nombre email')
            .populate('hospital')
            .exec((err, medicos) => {
                if (err) {
                    reject('error cargar medicos', err);
                } else {

                    resolve(medicos);
                }
            });

    });
}

function buscarUsuarios(busqueda, regex) {

    return new Promise((resolve, reject) => {
        Usuario.find({}, 'nombre email role')
            .or([{ 'nombre': regex }, { 'email': regex }])
            .exec((err, usuarios) => {
                if (err) {
                    reject('error cargar usuarios', err);
                } else {

                    resolve(usuarios);
                }
            });

    });
}

module.exports = app;