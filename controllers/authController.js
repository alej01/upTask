const passport = require('passport');
const usuarios = require('../model/Usuarios');
const crypto = require('crypto');
const bcrypt = require('bcrypt-nodejs')
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const email = require('../handlers/email');

exports.validarUsuario = passport.authenticate('local',{
    successRedirect : '/',
    failureRedirect: '/iniciarSesion',
    failureFlash: true,
    badRequestMessage: 'Ambos campos son obligatorios'
})

exports.validarSesion = (req, res, next) => {
    if (req.isAuthenticated()) {
        return next();
    }
    console.log("VALIDANDO EL LOG... ")
    return res.redirect('/iniciarSesion');

}

exports.cerrarSesion = (req,res,next) =>{
    req.session.destroy(()=>{
        res.redirect('/iniciarSesion')
    })
}

exports.enviarToken = async (req, res) =>{
    const usuario = await usuarios.findOne({
        where:{ email: req.body.email}
    })

    if (!usuario) {
        req.flash('alert-danger', 'No existe el correo ingresado')
        res.render('reestablecer',{
            nombrePagina: 'Reestablecer Password',
            mensajes: req.flash()
        })
    }

    usuario.token = crypto.randomBytes(10).toString('hex');
    usuario.expiracion = Date.now() + 3600000;

    const reseturl = `http://${req.headers.host}/reestablecer/${usuario.token}`;

    await email.enviarEmail ({
        usuario,
        subject: 'Resstablecer Password',
        reseturl,
        archivo: 'resetPassword'
    }).then(e =>{
        usuario.save();
        req.flash('alert-primary', 'Hemos enviado un link a su correo para restablecer el password');
        res.redirect('/reestablecer')
    }).catch(e =>{
        req.flash('alert-danger', 'Ha ocurrido un error');
        res.redirect('/reestablecer')
    })
    
    
}

exports.validarToken = async (req, res) =>{
    console.log(req.params.token);
    const usuario = await usuarios.findOne({
        where: {token : req.params.token}
    })
    console.log(usuario)
    if (!usuario) {
        req.flash('alert-danger', 'El token para reestablecer password no es valido')
        res.redirect('/reestablecer');
    }
 
    res.render('resetPassword', {
        nombrePagina: 'Resetear Password'
    })
}

exports.resetPassword = async (req, res) => {
    const usuario = await usuarios.findOne({
        where:{
            token: req.params.token,
            expiracion:{
                [Op.gte]: Date.now()
            }
        }
    });

    if (!usuario) {
        req.flash('alert-danger', 'Token no valido');
        res.redirect('/reestablecer');
    }

    usuario.password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    usuario.token = null;
    usuario.expiracion = null;

    await usuario.save();

    req.flash('alert-primary', 'Password reestablecido correctamente');
    res.redirect('/iniciarSesion')

}