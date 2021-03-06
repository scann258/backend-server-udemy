// Requires ( importacion de librerias de terceros o personalizadas )
var express = require('express'); // Servidor Express

var fileUpload = require('express-fileupload');

// FileSystem - para borrar el archivo y para ver si existe
var fs = require('fs');

// Modelos
var Usuario = require('../models/usuario');
var Medico = require('../models/medico');
var Hospital = require('../models/hospital');



// Inizializar variables
var app = express(); // Defino mi servidor Express

// default options
app.use(fileUpload());

// Rutas
app.put('/:tipo/:id', (req, res, next) => {

    var tipo = req.params.tipo;
    var id = req.params.id;

    // tipos de coleccion
    var tiposValidos = [ 'hospitales', 'medicos', 'usuarios'];
    if ( tiposValidos.indexOf( tipo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'El tipo de coleccion no es valido',
            errors: { message: 'Las colecciones Validas son: ' + tiposValidos.join(', ') }
        });
    }

    if ( !req.files ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'No selecciono nada',
            errors: { message: 'Debe de seleccionar una imagen' }
        });
    }

    // Obtener nombre del archivo
    var archivo = req.files.imagen;
    var nombreCortado = archivo.name.split('.');
    var extensionArchivo = nombreCortado[nombreCortado.length -1];

    // Solo estas extensiones aceptamos
    var extensionesValidas = [ 'png', 'jpg', 'gif', 'jpeg' ];

    if( extensionesValidas.indexOf( extensionArchivo ) < 0 ) {
        return res.status(400).json({
            ok: false,
            mensaje: 'Extension no Valida',
            extensionArchivo,
            errors: { message: 'Las extenciones Validas son: ' + extensionesValidas.join(', ') }
        });
    }

    // Nombre de archivo persolalizado
    var nombreArchivo = `${ id }-${ new Date().getMilliseconds() }.${extensionArchivo}`;

    // Mover el archivo del TMP al path especifico
    var path = `./uploads/${ tipo }/${ nombreArchivo }`;

    archivo.mv( path, err => {
        if ( err ) {
            return res.status(500).json({
                ok: false,
                mensaje: 'Error al mover el archivo',
                errors: err
            });
        }

        subirPorTipo( tipo, id, nombreArchivo, res );



    })


});


function subirPorTipo( tipo, id, nombreArchivo, res ) {

    if ( tipo === 'usuarios' ) {

        Usuario.findById( id, ( err, usuario ) => {

            if ( !usuario ) {

                return res.status(400).json({
                        ok: false,
                        mensaje: 'Error El Usuario con el id ' + id + 'no existe',
                        errors: { message: 'No existe un usuario con ese ID'}
                });
            }

            var pathViejo = './uploads/usuarios/' + usuario.img;

            // si existe borra el anterior
            if ( fs.existsSync( pathViejo ) ){
                fs.unlinkSync( pathViejo, (err) => {
                    return res.status(200).json({
                        ok: false,
                        mensaje: 'Error al borrar imagen',
                        errors: err
                    });
                });

            }

            usuario.img = nombreArchivo;

            usuario.save( (err, usuarioActualizado) => {

                usuarioActualizado.password = ':)';

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de usuario actualizada',
                    usuario: usuarioActualizado
                });

            });

        })

    }


    if ( tipo === 'medicos' ) {

        Medico.findById( id, ( err, medico ) => {

            if ( !medico ) {

                return res.status(400).json({
                        ok: false,
                        mensaje: 'Error El Medico con el id ' + id + 'no existe',
                        errors: { message: 'No existe un medico con ese ID'}
                });
            }

                var pathViejo = './uploads/medicos/' + medico.img;
                
                // si existe borra el anterior
                if ( fs.existsSync( pathViejo ) ){
                    fs.unlinkSync( pathViejo, (err) => {
                        return res.status(200).json({
                            ok: false,
                            mensaje: 'Error al borrar imagen',
                            errors: err
                        });
                    });
    
                }
           

            medico.img = nombreArchivo;

            medico.save( (err, medicoActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de medico actualizada',
                    medico: medicoActualizado
                });

            });

        })
        
    }


    if ( tipo === 'hospitales' ) {

        Hospital.findById( id, ( err, hospital ) => {

            if ( !hospital ) {

                return res.status(400).json({
                        ok: false,
                        mensaje: 'Error El Hospital con el id ' + id + 'no existe',
                        errors: { message: 'No existe un hospital con ese ID'}
                });
            }

            var pathViejo = './uploads/hospitales/' + hospital.img;

            // si existe borra el anterior
            if ( fs.existsSync( pathViejo ) ){
                fs.unlinkSync( pathViejo, (err) => {
                    return res.status(200).json({
                        ok: false,
                        mensaje: 'Error al borrar imagen',
                        errors: err
                    });
                });

            }

            hospital.img = nombreArchivo;

            hospital.save( (err, hospitalActualizado) => {

                return res.status(200).json({
                    ok: true,
                    mensaje: 'Imagen de hospital actualizada',
                    hospital: hospitalActualizado
                });

            });

        })
        
    }

}


module.exports = app;