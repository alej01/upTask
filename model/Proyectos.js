const Sequelize = require('sequelize');
const slug = require('slug');
const shortid = require('shortid')
const db = require('../config/db');


const Proyectos = db.define('proyectos', {
    id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: Sequelize.STRING,
    url: Sequelize.STRING

}, {
    hooks: {
        beforeCreate(pro){
            const url = slug(pro.nombre).toLowerCase();

            pro.url = url+'-'+shortid.generate();
        }
    }
});

module.exports = Proyectos;