
const Usuarios = require('../models/Usuarios')


exports.formCrearCuenta = (req, res) => {
    res.render('crearCuenta.pug', {
        nombrePagina: "Crear cuenta en GSoft Administrador de Proyectos"
    })
}

exports.formIniciarSesion = (req, res) => {
    const {error} = res.locals.mensajes;
    res.render('iniciarSesion.pug', {
        nombrePagina: "Iniciar sesión en Gsoft Adminitrador de Proyectos",
        error:error
    })
}

exports.crearCuenta = async (req, res) =>{
    //leer datos
    const {email,password} = req.body
    try {
         //crear el user
        await Usuarios.create({
            email,
            password
        });
        res.redirect('/iniciar-sesion')     
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en GSoft', 
            email,
            password
        })
    }
}
