
const Usuarios = require('../models/Usuarios')
const enviarEmail = require('../handler/email');


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

        //crear una URL para confirmar usuario
        const confirmarUrl = `http://${req.headers.host}/confirmar/${email}`;

        //crar el object de usuario
        const usuario = {
            email
        }

        //enviar el Email de verificación
        await enviarEmail.enviar({
            usuario,
            subject: 'Confirma tu cuenta de GSoft',
            confirmarUrl,
            archivo:'confirmar-cuenta'
        });

        //redirigir
        req.flash('correcto', 'Enviamos un correo para confirmar tu cuenta!');
        res.redirect('/iniciar-sesion')     
    } catch (error) {
        req.flash('error', error.errors.map(error => error.message));
        res.render('crearCuenta.pug', {
            mensajes: req.flash(),
            nombrePagina : 'Crear Cuenta en GSoft', 
            email,
            password
        })
    }
}

exports.formReestablecerPassword =  (req, res) =>{
    res.render('reestablecer.pug', {
        nombrePagina:'Restablecer Contraseña'
    })
}


//cambia estado de la cuenta 0 a 1
exports.confirmarCuenta = async (req, res) => {
    const usuario = await Usuarios.findOne({where:{
        email:req.params.correo
    }});

    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/crear-cuenta');
    }

    usuario.activo = 1;
    await usuario.save();
    req.flash('correcto', 'Cuenta activada correctamente!');
    res.redirect('/iniciar-sesion');
}