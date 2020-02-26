
// Requires ( importacion de librerias de terceros o personalizadas )
var jwt = require('jsonwebtoken'); // JSON Web Token
var SEED = require('../config/config').SEED; // Configuracion del SEED



// ----------------------------------------------------------
// ----------- Verificar Token - Middleware
// ----------------------------------------------------------

exports.verificaToken = function( req, res, next ) {

    var token = req.query.token;
    
    jwt.verify( token, SEED, ( err, decoded ) => {
    
        if ( err ) {
            return res.status(401).json({
                ok: false,
                mensaje: 'Error Token incorrecto',
                errors: err
            });           
        }

        req.usuario = decoded.usuario;
        next();
    
    });

}


