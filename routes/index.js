const express = require('express')
const router = express.Router()

//express validator
const {body} = require('express-validator')

//importar controlador
const proyectosController = require('../controllers/proyectosController')
const tareasController = require('../controllers/tareasController');
const usuariosController = require('../controllers/usuariosController');
const authController = require('../controllers/authController');

module.exports = function() {
    router.get('/',authController.usuarioAutenticado, proyectosController.proyectosHome);
    router.get('/nuevo-proyecto',authController.usuarioAutenticado, proyectosController.formularioProyecto);
    
    router.post('/nuevo-proyecto',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(),  //reventar espacios en blanco o caracteres raros
    proyectosController.nuevoProyecto);

    // Listar Proyecto
    router.get('/proyectos/:url',authController.usuarioAutenticado, proyectosController.proyectoPorUrl);


    //actualizar proyecto
    router.get('/proyectos/editar/:id',authController.usuarioAutenticado, proyectosController.formularioEditar);
    
    router.post('/nuevo-proyecto/:id',
    authController.usuarioAutenticado,
    body('nombre').not().isEmpty().trim().escape(), 
    proyectosController.actualizarProyecto);

    //Eliminar el proyect
    router.delete('/proyectos/:url',authController.usuarioAutenticado, proyectosController.eliminarProyecto);


    //********************TAREAS****************** */
    router.post('/proyectos/:url', authController.usuarioAutenticado, tareasController.agregarTarea)

    //actualizar tarea
    router.patch('/tareas/:id',authController.usuarioAutenticado, tareasController.cambiarEstadoTarea);

    //eliminar Tarea
    router.delete('/tareas/:id',authController.usuarioAutenticado, tareasController.eliminarTarea);



    //********************CREAR CUENTA******************************************** */
    router.get('/crear-cuenta', usuariosController.formCrearCuenta);
    router.post('/crear-cuenta', usuariosController.crearCuenta);
    router.get('/confirmar/:correo', usuariosController.confirmarCuenta);



    //**************************INICIAR SESION**************** */
    router.get('/iniciar-sesion', usuariosController.formIniciarSesion);
    router.post('/iniciar-sesion', authController.autenticarUsuario);

    //****************************Cerrar sesion********** */
    router.get('/cerrar-sesion', authController.cerrarSesion);

    //**********REEStablecer contraseña************** */
    router.get('/reestablecer', usuariosController.formReestablecerPassword);
    router.post('/reestablecer', authController.enviarToken);
    router.get('/reestablecer/:token', authController.validarToken);
    router.post('/reestablecer/:token', authController.actualizarPassword);



    //retornar el router
    return router
}
    

    
