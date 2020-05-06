// requires
var jwt = require('jsonwebtoken');
var SEED = require('../config/config').SEED;

//==========================================
//Verificar Token
//==========================================

exports.verificacionToken = function(request, response, next) {

    var token = request.query.token;

    jwt.verify(token, SEED, (error, decoded) => {
        if (error) {
            return response.status(400).json({
                mensaje: 'error en token',
                ok: false,
                errors: error
            });
        }
        request.usuario = decoded;
        request.userIdentity = decoded.usuario._id;
        next();

    });
}