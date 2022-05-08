const express = require('express');
const ligaControlador = require('../controllers/liga.controller');

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');

const api = express.Router();

api.post('/agregarLiga',[md_autenticacion.Auth],ligaControlador.agregarLiga);
api.put('/editarLiga/:idLiga',[md_autenticacion.Auth],ligaControlador.editarLiga);
api.delete('/eliminarLiga/:idLiga',[md_autenticacion.Auth],ligaControlador.eliminarLiga);
api.get('/encontrarLiga/:idLiga',[md_autenticacion.Auth],ligaControlador.obtenerLiga);

module.exports = api;