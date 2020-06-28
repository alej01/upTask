const Usuarios = require('../model/Usuarios');
const Email = require('../handlers/email');

exports.crearCuenta = (req, res) =>{
    res.render('crearCuenta', {
        nombrePagina: 'Crear nueva cuenta || upTask',
        cuentaOk: 0
    })
}

exports.iniciarSesion = (req, res) =>{
    const { error } = res.locals.mensajes;
    res.render('iniciarSesion', {
        nombrePagina: 'Login || upTask',
        error
    })
}

exports.registrarUsuario = async (req, res) =>{
    const { email, password } = req.body;

    try {
        await Usuarios.create({
            email, 
            password 
        })
        // enviar email
        const usuario = {
            email
        }

        const reseturl = `http://${req.headers.host}/confirmarCuenta/${email}`;

        console.log(Email.enviarEmail({
            usuario,
            subject: 'Confirmar cuenta',
            reseturl,
            archivo: 'confirmarCuenta'
        }))

        req.flash('alert-primary', "Se ha envido un correo a su email para confirmar su cuenta");
        res.redirect('iniciarSesion');
    } catch (error) {
        req.flash("alert-danger", error.errors.map(error => error.message));
        res.render('crearCuenta', {
            mensajes: req.flash(), 
            nombrePagina: 'Crear nueva cuenta || upTask',
            cuentaOk: 2,
            email,
            password
        })
    }
}

exports.reestablecerPassword = (req, res) =>{
    res.render('reestablecer',{
        nombrePagina: 'Reestablecer Password'
    })
}

exports.confirmarCuenta = async (req, res) =>{
    const us = await Usuarios.findOne({
        where: {email: req.params.email }
    })

    if (us.activo === 1) {
        req.flash('alert-danger', 'La cuenta ya ha sido confirmada antes');
        res.redirect('/iniciarSesion'); 
    }
    us.activo = 1;

    us.save();

    req.flash('alert-primary', 'La cuenta ha sido confirmada exitosamente');
    res.redirect('/iniciarSesion');
}