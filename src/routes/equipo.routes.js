const express = require('express');
const equipoControlador = require('../controllers/equipo.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();
api.post('/agregarEquipo',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],equipoControlador.agregarEquipo);
api.put('/editarEquipo/:idEquipo',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],equipoControlador.editarEquipo);
api.delete('/eliminarEquipo/:idEquipo',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],equipoControlador.eliminarEquipo);
api.get('/encontrarEquipo/:idEquipo',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],equipoControlador.obtenerEquipo);
api.get('/econtrarEquipoPorLiga/:idLiga',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],equipoControlador.obtenerEquipoPorLiga)
module.exports = api;

