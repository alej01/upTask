const passport = require('passport');
const passportLocal = require('passport-local').Strategy;

const Usuario = require('../model/Usuarios');

passport.use(
    new passportLocal (
        {
            usernameField: 'email',
            passwordField: 'password'
        },
        async (email, password, done) => {
            try {
                const usuario = await Usuario.findOne({
                    where: { email: email }
                });

                if(!usuario.validarPassword(password)){
                    return done(null, false, {
                        message: 'El password es incorrecto'
                    })
                }
                if(usuario.activo === 0){
                    return done(null, false, {
                        message: 'La cuenta aún no ha sido activada'
                    })
                }
                return done(null, usuario);
            } catch (error) {
                return done(null, false, {
                    message: 'El usuario no existe'
                })
            }
        }
    )
);

//serializar
passport.serializeUser((usuario, callback) => {
    callback(null, usuario);
})
//deserializar
passport.deserializeUser((usuario, callback) =>{
    callback(null, usuario);
})
module.exports = passport;