const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const flash = require('connect-flash');
const cookieParser = require('cookie-parser');
const expressSession = require('express-session') ;
const passport = require('./config/passport');

// Coneccion a DB

const db = require('./config/db');

// importar modelo

require('./model/Proyectos');
require('./model/Tareas');
require('./model/Usuarios');

db.sync()
    .then(() => console.log('Coneccion a la base de datos exitosa'))
    .catch(error => console.log('Error conectando a la base de datos'));


//Creando app de express
const app = express();

//cargar archivos estaticos
app.use(express.static('public'));

// habilitar body parser
app.use(bodyParser.urlencoded({extended: true}));

//agregar flash
app.use(flash());

//

app.use(cookieParser());

app.use(expressSession({
    secret: 'secreto',
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

//habilitar Pug
app.set('view engine', 'pug');

//Anadir la carpeta de vistas
app.set('views', path.join(__dirname, './views'));

app.use((req, res, next) =>{
    res.locals.mensajes = req.flash();
    res.locals.usuario = {...req.user} || null;
    next();
})
/*
var fs = require('fs'); 
var util = require('util');
var log_file = fs.createWriteStream(__dirname + '/node.log', {flags : 'w'});
var log_stdout = process.stdout;

console.log = async function(d) { //
 log_file.write(util.format(d) + '\n');
 log_stdout.write(util.format(d) + '\n');
};*/


app.use('/', routes());


app.listen(3000);

require('./handlers/email');