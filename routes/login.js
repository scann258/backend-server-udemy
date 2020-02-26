// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express
var Usuario = require('../models/usuario'); // Modelo de usuario
var bcrypt = require('bcryptjs'); // Para encriptar la contraseña
var jwt = require('jsonwebtoken'); // JSON Web Token
var SEED = require('../config/config').SEED; // Configuracion del SEED


// Inizializar variables
var app = express(); // Defino mi servidor Express



// Metodo del Login
app.post('/', (req, res ) => {

    var body = req.body

    Usuario.findOne({ email: body.email }, ( err, usuarioDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        // Chequeo si el email existe
        if ( !usuarioDB ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Credenciales incorrectas - email',
                errors: err
            });
        }

        // Chequeo si el password existe
        if( !bcrypt.compareSync( body.password, usuarioDB.password ) ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error Credenciales incorrectas - password',
                errors: err
            });
        }

        // Crear Token!
        usuarioDB.password = ':)';
        var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 Horas


        res.status(200).json({
            ok: true,
            usuario: usuarioDB,
            token,
            id: usuarioDB._id
        });   

    });
 
});




module.exports = app;