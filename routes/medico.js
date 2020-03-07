// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express
var Medico = require('../models/medico'); // Modelo de Medico

var mdAutenticacion = require('../middlewares/autenticacion'); // Middlerares de autentificacion


// Inizializar variables
var app = express(); // Defino mi servidor Express



// Rutas

// ----------------------------------------------------------
// ----------- Obtener todos los medicos 
// ----------------------------------------------------------

app.get('/', (req, res, next) => {

    var desde = req.query.desde || 0;
    desde = Number(desde);

    Medico.find({})
        .skip(desde)
        .limit(5)
        .populate('usuario','nombre email')
        .populate('hospital')
        .exec(
            ( err, medicos ) => {
                if ( err ) {
                    return res.status(500).json({
                        ok: false,
                        mensaje: 'Error cargando Medicos',
                        errors: err
                    });
                }

                Medico.count({}, (err, conteo)=> {

                    res.status(200).json({
                        ok: true,
                        total: conteo,
                        medicos
                    });    

                })


    });     


});



// ----------------------------------------------------------
// ----------- Actualizar un medico 
// ----------------------------------------------------------
app.put('/:id', mdAutenticacion.verificaToken, ( req, res ) => {
    
    var id = req.params.id;
  
    var body = req.body;
    
    Medico.findById( id, ( err, medico ) => {
  
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error El Medico no existe',
                errors: err
            });
        }

        if ( !medico ) {

            return res.status(400).json({
                    ok: false,
                    mensaje: 'Error El Medico con el id ' + id + 'no existe',
                    errors: { message: 'No existe un medico con ese ID'}
            });
        }

        medico.nombre = body.nombre;
        medico.usuario = req.usuario._id;
        medico.hospital = body.hospital;
        
        medico.save( ( err, medicoGuardado ) => {

            if ( err ) {
                return res.status(400).json({
                    ok: false,
                    mensaje: 'Error al actualizar medico',
                    errors: err
                });
            }

            res.status(200).json({
                ok: true,
                medico: medicoGuardado
            });

        });

    });

});





// ----------------------------------------------------------
// ----------- Crear un hospital 
// ----------------------------------------------------------

app.post('/', mdAutenticacion.verificaToken, ( req, res ) => {

    var body = req.body;

    var medico = new Medico ({
        nombre: body.nombre,
        usuario: req.usuario._id,
        hospital: body.hospital
    });

    medico.save( ( err, medicoGuardado) => {

        if ( err ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error creando Medico',
                errors: err
            });
        }

        res.status(201).json({
            ok: true,
            medico: medicoGuardado
        });

    })


});


// ----------------------------------------------------------
// ----------- Borrar un hospital 
// ----------------------------------------------------------

app.delete('/:id', mdAutenticacion.verificaToken, ( req, res ) => {

    var id = req.params.id;

    Medico.findByIdAndRemove( id, ( err, medicoBorrado )=> {

        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al borrar Medico',
                errors: err
            });
        }

        if ( !medicoBorrado ) {
            return res.status(400).json({
                ok: false,
                mensaje: 'Error No existe Medico con ese ID',
                errors: { message: 'Error No existe Medico con ese ID'}
            });
        }

        res.status(200).json({
            ok: true,
            medico: medicoBorrado
        });

    });

});


// Exportar modulo app
module.exports = app;