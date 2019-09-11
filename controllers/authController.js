const passport = require('passport');
const Usuarios = require('../models/Usuarios');
const crypto = require('crypto');
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const bcrypt = require('bcrypt-nodejs');
const enviarEmail = require('../handler/email');
const Usuario = require('../models/Usuarios');



exports.autenticarUsuario = passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/iniciar-sesion',
    failureFlash:true,
    badRequestMessage:'Ambos campos son obligatorios'
});

exports.usuarioAutenticado = (req,res,next) => {
    //si esta autenticado, ok
    if(req.isAuthenticated()){
        return next()
    }
    //si no esta autenticado, redirigir al form
    return res.redirect('/iniciar-sesion')
}

//cerrar sesion
exports.cerrarSesion = (req,res)=>{
    req.session.destroy( ()=>{
        res.redirect('/');
    })
}





//genera un token si el user es valido
exports.enviarToken = async (req,res) =>{
    //ver que el user existe
    const usuario = await Usuarios.findOne({where:{email: req.body.email}});

    //si no existe el usuario
    if (!usuario){
        req.flash('error', 'No existe esa cuenta');
        res.redirect('/reestablecer');
    }

    //ususario si existe
    usuario.token=crypto.randomBytes(20).toString('hex');
    usuario.expiracion = Date.now() + 3600000; //1 hora
    //guardar en db
   await usuario.save();

   //url de reset
   const resetUrl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

   //envia el correo con el token
   await enviarEmail.enviar({
       usuario,
       subject: 'Password Reset',
       resetUrl,
       archivo: 'reestablecer-password'
   });
   req.flash('correcto', 'Se envió un mensaje a tu Email');
   res.redirect('/iniciar-sesion')
}





exports.validarToken = async (req,res) => {
    const usuario = await Usuarios.findOne({where:{
        token: req.params.token
    }});
    //si no encuentra el user
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }
    //form para generar el pass
    res.render('resetPassword.pug',{
        nombrePagina:"Reestablecer Contraseña"
    })
}

//cambia el pass x uno nuevo
exports.actualizarPassword = async (req, res) =>{
//token valido y fecha de expiracion valida
    const usuario = await Usuarios.findOne({where:{
        token:req.params.token,
        expiracion: {
            [Op.gte] : Date.now()
        }
    }});

    //verificamos si user existe
    if(!usuario){
        req.flash('error', 'No Valido');
        res.redirect('/reestablecer');
    }

    //hashear el password nuevo
    //req.body.password viene del form resetpassword, name=password
    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token=null;
    usuario.expiracion=null;

    //guardamos el new passw
    await usuario.save();
    req.flash('correcto','Tu contraseña se ha modificado correctamente');
    res.redirect('/iniciar-sesion');
}