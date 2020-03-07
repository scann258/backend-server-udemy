// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express
var Hospital = require('../models/hospital'); // Modelo de Hospital

var mdAutenticacion = require('../middlewares/autenticacion'); // Middlerares de autentificacion


// Inizializar variables
var app = express(); // Defino mi servidor Express



// Rutas

// ----------------------------------------------------------
// ----------- Obtener todos los hospitales 
// ----------------------------------------------------------

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Hospital.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario', 'nombre email')
        .exec(
            ( err, hospitales ) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Hospitales',
                        errors: err
                    });
                }

                Hospital.count({}, (err, conteo)=> {

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        hospitales
                    });    

                })


    });     


});



// ----------------------------------------------------------
// ----------- Actualizar un hospital 
// ----------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) => {
    
    var id = req.params.id;
  
    var body = req.body;
    
    Hospital.findById( id, ( err, hospital ) => {
  
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error Hospital no existe',
                errors: err
            });
        }

        if ( !hospital ) {

            return res.status(400).json({
                    ok: false,
                    mensaje: 'Error El Hopital con el id ' + id + 'no existe',
                    errors: { message: 'No existe un hospital con ese ID'}
            });
        }

        hospital.nombre = body.nombre;
        hospital.usuario = req.usuario._id;

        hospital.save( ( err, hospitalGuardado ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar hospital',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                hospital: hospitalGuardado
            });

        });

    });

});





// ----------------------------------------------------------
// ----------- Crear un hospital 
// ----------------------------------------------------------

app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {

    var body = req.body;

    var hospital = new Hospital ({
        nombre: body.nombre,
        usuario: req.usuario._id
    });

    hospital.save( ( err, hospitalGuardado) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando Hospital',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            hospital: hospitalGuardado
        });

    })


});


// ----------------------------------------------------------
// ----------- Borrar un hospital 
// ----------------------------------------------------------

app.delete('/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    var id = req.params.id;

    Hospital.findByIdAndRemove( id, ( err, hospitalBorrado )=> {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Hospital',
                errors: err
            });
        }

        if ( !hospitalBorrado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error No existe Hospital con ese ID',
                errors: { message: 'Error No existe Hospital con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            hospital: hospitalBorrado
        });

    });

});


// Exportar modulo app
module.exports = app;