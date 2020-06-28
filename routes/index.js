const express = require('express');
const router = express.Router();

const { body } = require('express-validator/check');

//Exportar controlador
const proyectosController = require('../controllers/proyeectosControllers');
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function(){
    router.get('/', 
        authController.validarSesion,
        proyectosController.proyectosHome
    );
    router.get('/nuevoProyecto',
                authController.validarSesion,
                proyectosController.formularioProyecto);

    router.post('/nuevoProyecto',
                authController.validarSesion, 
                body('nombre').not().isEmpty().trim().escape(),
                proyectosController.nuevoProyecto);
    router.post('/nuevoProyecto/:id',
                authController.validarSesion,
                body('nombre').not().isEmpty().trim().escape(),
                proyectosController.guardarProyecto);

    router.get('/proyectos/:url',
                authController.validarSesion,
                proyectosController.proyectoPorURL);
    router.get('/editar/:id',
                authController.validarSesion,
                proyectosController.editarProyecto);

    //Eliminar proyecto
    router.delete('/proyectos/:url',
                authController.validarSesion,
                proyectosController.eliminarProyecto);

    //TAREAS
    router.post('/proyectos/:id',
                authController.validarSesion,
                tareasController.crearTareas)

    router.patch('/tareas/:id',
                authController.validarSesion,
                tareasController.modificarEstado)

    router.delete('/tareas/:id',
                authController.validarSesion,
                tareasController.eliminarTarea)
    
    //USUARIOS
    router.get('/crearCuenta/', usuariosController.crearCuenta)
    router.post('/crearCuenta/', usuariosController.registrarUsuario)
    router.get('/iniciarSesion', usuariosController.iniciarSesion)
    router.post('/iniciarSesion', authController.validarUsuario)
    router.get('/cerrarSesion', authController.cerrarSesion)
    router.get('/reestablecer', usuariosController.reestablecerPassword)
    router.post('/reestablecer', authController.enviarToken)
    router.get('/reestablecer/:token', authController.validarToken)
    router.post('/reestablecer/:token', authController.resetPassword)
    router.get('/confirmarCuenta/:email', usuariosController.confirmarCuenta)

    return router;
    
}

