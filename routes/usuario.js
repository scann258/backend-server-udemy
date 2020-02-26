// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express
var Usuario = require('../models/usuario'); // Modelo de usuario
var bcrypt = require('bcryptjs'); // Para encriptar la contraseña
var jwt = require('jsonwebtoken'); // JSON Web Token

var mdAutenticacion = require('../middlewares/autenticacion');



// Inizializar variables
var app = express(); // Defino mi servidor Express


// Rutas

// ----------------------------------------------------------
// ----------- Obtener todos los usuarios 
// ----------------------------------------------------------
app.get('/', (req, res, next) => {

    Usuario.find({}, 'nombre email imagen role')
        .exec(
             ( err, usuarios ) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Usuarios',
                        errors: err
                    });
                }

                res.status(200).json({
                    ok: true,
                    usuarios
                });    

            });
});





// ----------------------------------------------------------
// ----------- Actualizar un usuario 
// ----------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) => {
    
    var id = req.params.id;
  
    var body = req.body;
    
    Usuario.findById( id, ( err, usuario ) => {
  
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error Usuario no existe',
                errors: err
            });
        }

        if ( !usuario ) {

            return res.status(400).json({
                    ok: false,
                    mensaje: 'Error El Usuario con el id ' + id + 'no existe',
                    errors: { message: 'No existe un usuario con ese ID'}
            });
        }

        usuario.nombre = body.nombre;
        usuario.email = body.email;
        usuario.role = body.role;

        usuario.save( ( err, usuarioGuardado ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar usuario',
                    errors: err
                });
            }

            usuarioGuardado.password = ':)';

            res.status(200).json({
                ok: true,
                usuario: usuarioGuardado
            });

        });

    });

});


// ----------------------------------------------------------
// ----------- Crear un usuario 
// ----------------------------------------------------------
app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {

    var body = req.body;

    var usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        imagen: body.imagen,
        role: body.role
    });

    usuario.save( ( err, usuarioGuardado) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando Usuario',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            usuario: usuarioGuardado,
            usuarioToken: req.usuario
        });

    })


});

// ----------------------------------------------------------
// ----------- Borrar un usuario 
// ----------------------------------------------------------

app.delete('/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    var id = req.params.id;

    Usuario.findByIdAndRemove( id, ( err, usuarioBorrado )=> {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Usuario',
                errors: err
            });
        }

        if ( !usuarioBorrado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error No existe Usuario con ese ID',
                errors: { message: 'Error No existe Usuario con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            usuario: usuarioBorrado
        });

    });

});



// Exportar modulo app
module.exports = app;