// requires
var express = require('express');
var bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
const { OAuth2Client } = require('google-auth-library');

var SEED = require('../config/config').SEED;
var CLIENT_ID = require('../config/config').CLIENT_ID;
var Usuario = require('../models/usuario');
const client = new OAuth2Client(CLIENT_ID);

// Inicializar variables
var app = express();

//==========================================
//login de un usuario normal
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

//==========================================
//login de un usuario Google
//==========================================

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID, // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    //const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];

    return {
        nombre: payload.name,
        email: payload.email,
        google: true,
        img: payload.picture
    }
}

app.post('/google', async(request, response) => {

    var token = request.body.token;
    var googleUser = verify(token)
        .catch(e => {
            return response.status(403).json({
                mensaje: 'token no valido',
                ok: false,
                errors: e
            });
        });

    Usuario.findOne({ email: googleUser.email }, (error, usuarioDB) => {

        if (err) {
            return response.status(500).json({
                mensaje: 'error al loguear usuario',
                ok: false,
                errors: err
            });
        }

        if (usuarioDB) {
            if (!usuarioDB.google) {
                return response.status(400).json({
                    mensaje: 'debe usar su atenticacion normal',
                    ok: false,
                    errors: { message: 'debe usar su atenticacion normal' }
                });
            } else {
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 });

                return response.status(200).json({
                    usuario: usuarioDB,
                    ok: true,
                    id: usuarioDB.id,
                    token: token
                });
            }

        } else {

            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre,
                usuario.email = googleUser.email,
                usuario.img = googleUser.img,
                usuario.password = ':)',
                usuario.google = true


            usuario.save((error, usuarioGuardado) => {
                if (error) {
                    return response.status(500).json({
                        mensaje: 'error al crear usuario desde google',
                        ok: false,
                        errors: err
                    });
                } else {
                    return response.status(201).json({
                        usuario: usuarioGuardado,
                        usuarioToken: request.usuario,
                        ok: true,
                    });
                }
            });
        }


    });
});

module.exports = app;