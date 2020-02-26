// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express

// Inizializar variables
var app = express(); // Defino mi servidor Express

// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});

module.exports = app;