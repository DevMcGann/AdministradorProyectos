const passport = require('passport');

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