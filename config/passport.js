const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;

//ref al modelo que vamos a autenticar
const Usuarios = require('../models/Usuarios');

passport.use(
    new LocalStrategy(
        {
            usernameField:'email',  //como este en el modelo
            passwordField:'password'
        },
        async (email,password,done) =>{
            try {
                const usuario = await Usuarios.findOne({
                    where:{
                        email:email,
                        activo:1
                    }

                });
                // usuario existe pero pass incorrecta
                if(!usuario.verificarPassword(password)){
                    return done(null,false,{
                        message:"Password incorrecto!"
                    });
                }
                //si email y pass son OK
                return done(null,usuario);
            } catch (error) {
                //user no existe
                return done(null,false,{
                    message:"Esa cuenta no existe"
                })
            }
        }
    )
);

//serializar el usuario
passport.serializeUser((usuario,callback)=>{
    callback(null,usuario);
});
//deszerializar el usuario
passport.deserializeUser((usuario,callbak)=>{
    callbak(null,usuario);
});

module.exports = passport;