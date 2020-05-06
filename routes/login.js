// requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

var SEED = require('../config/config').SEED;
var Usuario = require('../models/usuario');

// Inicializar variables
var app = express();

//==========================================
//login de un usuario
//==========================================
app.post('/', (request, response) => {

    var body = request.body;
    console.log(body);
    Usuario.findOne({ email: body.email }, (err, usuarioDB) => {

        if (err) {
            return response.status(500).json({
                mensaje: 'error al loguear usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuarioDB) {
            return response.status(400).json({
                mensaje: 'usuario con email: ' + body.email + ' no existe',
                ok: false,
                errors: { message: 'usuario con email: ' + body.email + ' no existe' }
            });
        }

        if (!bcrypt.compareSync(body.password, usuarioDB.password)) {
            return response.status(400).json({
                mensaje: 'clave incorrecta',
                ok: false,
                errors: { message: 'clave incorrecta' }
            });
        }
        usuarioDB.password = ':D';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

        return response.status(200).json({
            usuario: usuarioDB,
            ok: true,
            id: usuarioDB.id,
            token: token
        });

    });
});

module.exports = app;