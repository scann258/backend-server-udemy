// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express
var mongoose = require('mongoose'); // Libreria para conectar con DB Mongoose
var bodyParser = require('body-parser') // Midelware para hacer post

// Importar Rutas
var appRoutes = require('./routes/app'); 
var usuarioRoutes = require('./routes/usuario');
var hospitalRoutes = require('./routes/hospital');
var medicoRoutes = require('./routes/medico');
var loginRoutes = require('./routes/login');
var busquedaRoutes = require('./routes/busqueda');
var uploadRoutes = require('./routes/upload');
var imagenesRoutes = require('./routes/imagenes');


// Inizializar variables
var app = express(); // Defino mi servidor Express



// Body Parser
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


// Conexion a DB
mongoose.connection.openUri('mongodb://localhost:27017/hospitalDB', ( err, res ) => {
    if( err ) throw err;

    console.log('Base de datos: \x1b[32m%s\x1b[0m','online');
});


// Server index config - Para ver las imagene desde el filesystem sabiendo la url
// var serverIndex = require('serve-index');
// app.use(express.static(__dirname + '/'));
// app.use('/uploads', serveIndex(__dirname + '/uploads'));


// Rutas
app.use('/usuario', usuarioRoutes);
app.use('/hospital', hospitalRoutes);
app.use('/medico', medicoRoutes);
app.use('/login', loginRoutes);
app.use('/busqueda', busquedaRoutes);
app.use('/upload', uploadRoutes);
app.use('/imagen', imagenesRoutes);

app.use('/', appRoutes); // Esta debe ser la ultima ruta



// Escuchar peticiones del Servidor Express - Puerto 3000

// Codigo para que en la consola aparezca de color verde 
// en el segundo parametro \x1b[32m%s\x1b[0m
app.listen(3000, () => {
    console.log('Server Express corriendo en el puerto 3000: \x1b[32m%s\x1b[0m','online');
});