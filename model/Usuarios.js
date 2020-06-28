const Sequelize = require('sequelize');
const db = require('../config/db');
const Proyectos = require('./Proyectos');
const bcrypt = require('bcrypt-nodejs')

const Usuarios = db.define('usuarios', {
    id:{
       type: Sequelize.INTEGER,
       primaryKey: true,
       autoIncrement: true
    },
    email:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            isEmail:{
                msg: 'Ingrese un correo valido'
            },
            notEmpty:{
                msg:'El correo no puede ir vacio'
            }
        }, 
        unique:{
            msg: 'El usuario ya esta registrado'
        }
    },
    password:{
        type: Sequelize.STRING(60),
        allowNull: false,
        validate:{
            notEmpty:{
                msg:'Ingrese un password'
            }
        },
    },
    activo:{
        type: Sequelize.INTEGER(1),
        defaultValue: 0
    },
    token: Sequelize.STRING(20), 
    expiracion: Sequelize.DATE
},
{
    hooks:{
        beforeCreate(usuario){
            usuario.password = bcrypt.hashSync(usuario.password, bcrypt.genSaltSync(10))
        }
    }
});

//Usuarios.hasMany(Proyectos);

Usuarios.prototype.validarPassword = function(password) {
    return bcrypt.compareSync(password, this.password);
}

Usuarios.hasMany(Proyectos);

module.exports = Usuarios;