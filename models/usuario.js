var mongoose = require('mongoose');
var uniqueValidator = require('mongoose-unique-validator');

var Schema = mongoose.Schema;

var rolesValidados = {
    values: ['ADMIN_ROLES', 'USER_ROLES'],
    message: '{VALUE} no es un rol permitido'

}

var usurioSchema = new Schema({

    nombre: { type: String, required: [true, 'El nombre es necesario'] },
    email: { type: String, unique: true, required: [true, 'El correo es necesario'] },
    password: { type: String, required: [true, 'la contraseña es obligatoria'] },
    img: { type: String, required: false },
    role: { type: String, required: true, default: 'USER_ROLES', enum: rolesValidados },
    google: { type: Boolean, default: false },

});

usurioSchema.plugin(uniqueValidator, { message: '{ PATH }el correo debe ser unico' });

module.exports = mongoose.model('Usuario', usurioSchema);