// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express

// Inizializar variables
var app = express(); // Defino mi servidor Express

const path = require('path'); // para crear un Path no importa si estoy en desarrollo o produccion
const fs = require('fs'); // FileSistem - crear archivos, mover, ver si existen archivos

// Rutas
app.get('/:tipo/:img', (req, res, next) => {

    var tipo = req.params.tipo;
    var img = req.params.img;

    var pathImagen = path.resolve( __dirname, `../uploads/${ tipo }/${ img }` );
    
    if ( fs.existsSync( pathImagen ) ) {
        res.sendFile( pathImagen );
    } else {
        var pathNoImagen = path.resolve( __dirname,'../assets/no-img.jpg' );
        res.sendFile( pathNoImagen );
    }

});

module.exports = app;