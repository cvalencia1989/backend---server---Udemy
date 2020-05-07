// requires
var express = require('express');
var bcrypt = require('bcryptjs');
var salt = bcrypt.genSaltSync(10);
var hash = bcrypt.hashSync('B4c0/\/', salt);
var jwt = require('jsonwebtoken');
var middelwareAutentication = require('../middelwares/autenticacion');
var Usuario = require('../models/usuario');

// Inicializar variables
var app = express();


//==========================================
//Obtiene lista de usuarios
//==========================================
app.get('/', (request, response, next) => {

    var desde = request.query.desde || 0;
    desde = Number(desde);

    Usuario.find({}, "nombre email img role")
        .limit(2)
        .skip(desde)
        .exec((err, usuarios) => {
            if (err) {
                return response.status(401).json({
                    mensaje: 'error cargando usaurio',
                    ok: false,
                    errors: err
                });
            }

            Usuario.count({}, (err, conteo) => {

                if (err) {
                    return response.status(401).json({
                        mensaje: 'error contato usaurio',
                        ok: false,
                        errors: err
                    });
                }

                return response.status(200).json({
                    usuarios: usuarios,
                    ok: true,
                    totalUsuario: conteo
                });
            });

        });

});

//==========================================
//crea nuevo usuario
//==========================================
app.post('/', middelwareAutentication.verificacionToken, (request, response) => {

    var body = request.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        img: body.img,
        role: body.role
    });

    usuario.save((err, usuarioGuardado) => {
        if (err) {
            return response.status(400).json({
                mensaje: 'error al crear usaurio',
                ok: false,
                errors: err
            });
        }

        return response.status(201).json({
            usuario: usuarioGuardado,
            usuarioToken: request.usuario,
            ok: true,
        });

    });

});

//==========================================
//actualiazr nuevo usuario
//==========================================
app.put('/:id', middelwareAutentication.verificacionToken, (request, response) => {

    var id = request.params.id;
    var body = request.body;

    Usuario.findById(id, (err, usuario) => {
        if (err) {
            return response.status(500).json({
                mensaje: 'error al buscar usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuario) {
            return response.status(400).json({
                mensaje: 'usuario con id: ' + id + ' no existe',
                ok: false,
                errors: { message: 'usuario con id: ' + id + ' no existe' }
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save((err, usuarioGuardado) => {
            if (err) {
                return response.status(400).json({
                    mensaje: 'error al actualizar usaurio',
                    ok: false,
                    errors: err
                });
            }
            usuarioGuardado.password = ":)";
            return response.status(201).json({
                usuario: usuarioGuardado,
                ok: true,
            });

        });
    });
});

//==========================================
//borrar un usuario
//==========================================
app.delete('/:id', middelwareAutentication.verificacionToken, (request, response) => {

    var id = request.params.id;

    Usuario.findByIdAndDelete(id, (err, usuarioBorrado) => {
        if (err) {
            return response.status(500).json({
                mensaje: 'error al borrar usuario',
                ok: false,
                errors: err
            });
        }

        if (!usuarioBorrado) {
            return response.status(400).json({
                mensaje: 'usuario con id: ' + id + ' no existe, por lo tanto no se pudo eliminar',
                ok: false,
                errors: { message: 'usuario con id: ' + id + ' no existe, por lo tanto no se pudo eliminar' }
            });
        }

        return response.status(201).json({
            usuario: usuarioBorrado,
            ok: true,
        });


    });
});


module.exports = app;