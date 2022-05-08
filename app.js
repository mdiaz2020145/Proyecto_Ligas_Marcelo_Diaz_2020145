//Importaciones
const express = require('express');
const cors = require('cors');

var app = express();


//Middlewares -> INTERMEDIARIOS
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

//Rutas 
const UsuarioRutas = require('./src/routes/usuario.routes');
const ligaRutas = require('./src/routes/liga.routes');
const equipoRutas = require('./src/routes/equipo.routes');
const partidoRutas = require('./src/routes/partido.routes')
//Cabeceras
app.use(cors());


//CARGA DE RUTAS
app.use('/api',UsuarioRutas,ligaRutas,equipoRutas,partidoRutas);


module.exports = app;
