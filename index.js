const express = require('express');
const routes = require('./routes');
const path = require('path');
const bodyParser = require('body-parser');
const helpers = require('./helpers');
const flash = require('connect-flash');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

const db = require('./config/db');

//import modelos
require('./models/Proyectos');
require('./models/Tareas');
require('./models/Usuarios');

db.sync() //sync crea las tablas en la db especificadas enel modelo
    .then( () => console.log("Conectado a la db"))
    .catch(error => console.log(error));

const app = express();

//habilitar bodyparser para leer los datos del formulario//
app.use(bodyParser.urlencoded({extended:true}));


//donde cargar los archivos estaticos
app.use(express.static('public'))
//habilitar pug
app.set('view.engine','pug');

//setear la carpeta de las vistas
app.set('views', path.join(__dirname, './views'));



//agregar el flash messages
app.use(flash());

app.use(cookieParser());

//sessions permiten navegar entre paginas sin tener que volver a loguear
app.use(session({
    secret:'secretito',
    resave:false,
    saveUninitialized:false
}));

app.use(passport.initialize());
app.use(passport.session());

//helper con el vardump
app.use((req,res,next) => {
    res.locals.vardump = helpers.vardump 
    //res locals es para crear aca y consumir en cualquier parte del proyecto
    res.locals.mensajes = req.flash();
    next();
    //next para garantizar que pase al siguiende MW
});


app.use('/', routes());

app.listen(3000)