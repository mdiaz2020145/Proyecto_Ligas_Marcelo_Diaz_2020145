const express = require('express');
const usuarioControlador = require('../controllers/usuario.controller'); 

const md_autenticacion = require('../middlewares/autenticacion');
const md_autenticacion_roles = require('../middlewares/roles');


const api = express.Router();
api.post('/login',usuarioControlador.login);

//LADO DEL ADMIN 
api.post('/registrarUsuarios',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],usuarioControlador.registrarUsuario);
api.put('/editarUsuario/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],usuarioControlador.editarUsuario);
api.delete('/eliminarUsuario/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.verAdministrador],usuarioControlador.eliminarUsuario);

//LADO DEL USUARIO 
api.post('/registrarCliente',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.registrarCliente);
api.put('/editarCuenta/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.editarCuenta);
api.delete('/eliminarCuenta/:idUsuario',[md_autenticacion.Auth,md_autenticacion_roles.VerUsuario],usuarioControlador.eliminarCuenta);

module.exports = api;