var mongoose = require('mongoose'); // Libreria para conectar con DB Mongoose
var uniqueValidator = require('mongoose-unique-validator'); // Validar mensajes de error de mongoose

var Schema = mongoose.Schema;


var rolesValidos = {

    values: ['ADMIN_ROLE','USER_ROLE'],
    message: 'No es un role permitido'

};


var usuarioSchema = new Schema({

    nombre:    { type: String, required: [true, 'El nombre es requerido'] },
    email:     { type: String, required: [true, 'El email es requerido'], unique: true },
    password:  { type: String, required: [true, 'La contraseña es requerida'] },
    imagen:    { type: String, required: false },
    role:      { type: String, required: true, default: 'USER_ROLE', enum: rolesValidos }

});

usuarioSchema.plugin( uniqueValidator, { message: '{PATH} debe ser unico' });

module.exports = mongoose.model('Usuario', usuarioSchema);