// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express
var mongoose = require('mongoose'); // Libreria para conectar con DB Mongoose



// Inizializar variables
var app = express(); // Defino mi servidor Express



// Conexion a DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
});



// Rutas
app.get('/', (req, res, next) => {

    res.status(200).json({
        ok: true,
        mensaje: 'Peticion realizada correctamente'
    });

});



// Escuchar peticiones del Servidor Express - Puerto 3000

// Codigo para que en la consola aparezca de color verde 
// en el segundo parametro \x1b[32m%s\x1b[0m
app.listen(3000, () => {
    console.log('Server Express corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});