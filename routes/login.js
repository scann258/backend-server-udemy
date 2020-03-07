// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express
var Usuario = require('../models/usuario'); // Modelo de usuario
var bcrypt = require('bcryptjs'); // Para encriptar la contraseña
var jwt = require('jsonwebtoken'); // JSON Web Token
var SEED = require('../config/config').SEED; // Configuracion del SEED

// Inizializar variables
var app = express(); // Defino mi servidor Express


// Google
var CLIENT_ID = require('../config/config').CLIENT_ID; // Configuracion del client id de google
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

// Metodo de Login por Google
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: CLIENT_ID,  // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();
    // const userid = payload['sub'];
    // If request specified a G Suite domain:
    //const domain = payload['hd'];
    
    return { 
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
     }
  }

app.post('/google', async (req,res) => {

    var token = req.body.token;

    var googleUser = await verify(token)
        .catch( err => {
            return res.status(403).json({
                ok: false,
                mensaje: 'Token no valido'
            });
        })

    Usuario.findOne( {email: googleUser.email }, ( err, usuarioDB ) => {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al buscar Usuario',
                errors: err
            });
        }

        if ( usuarioDB ) {

            if ( usuarioDB.google === false ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Debe de usar su autenticacion normal'
                });
            } else {

                // Crear Token!
                usuarioDB.password = ':)';
                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 Horas

                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id
                });

            }

        } else {
            // El usuario no existe hay que crearlo
            var usuario = new Usuario();

            usuario.nombre = googleUser.nombre;
            usuario.email = googleUser.email;
            usuario.img = googleUser.img;
            usuario.google = true;
            usuario.password = ':)';

            usuario.save( (err, usuarioDB) => {

                var token = jwt.sign({ usuario: usuarioDB }, SEED, { expiresIn: 14400 }); // 4 Horas
                
                res.status(200).json({
                    ok: true,
                    usuario: usuarioDB,
                    token,
                    id: usuarioDB._id
                });
            });
        }

    });    

    // return res.status(200).json({
    //     ok: true,
    //     mensaje: 'Todo Ok',
    //     googleUser
    // });


});



// Metodo del Login Normal
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