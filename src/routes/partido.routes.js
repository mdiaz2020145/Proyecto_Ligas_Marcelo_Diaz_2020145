const express = require('express');
const partidoControlador = require('../controllers/partido.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();

api.post('/agregarPartido',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],partidoControlador.agregarPartido);
api.get('/generarReporte/:idLiga',[md_autenticacion.Auth],partidoControlador.crearReporte);

module.exports = api;
