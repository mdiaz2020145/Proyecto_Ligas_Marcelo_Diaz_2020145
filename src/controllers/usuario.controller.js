//Importaciones 
const express = require('express');
const Usuario = require('../models/usuario.model');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');

//Registrar Admin 
function registrarAdmin(req,res){
    var usuarioModelo = new Usuario();
    usuarioModelo.nombre = 'ADMIN';
    usuarioModelo.email = 'ADMIN';
    usuarioModelo.rol = 'ROL_ADMINISTRADOR';

    Usuario.find({ email: 'ADMIN', nombres: 'ADMIN'}, (err, usuarioGuardado) => {
        if (usuarioGuardado.length == 0) {
            bcrypt.hash("deportes123",null, null, (err, passswordEncypt) => {
                usuarioModelo.password = passswordEncypt
                usuarioModelo.save((err, usuarioGuardado) => {
                    console.log(err)
                })
            })
        } else {
            console.log('El usuario admin ya esta creado')
        }
    })

}

//Registrar Cliente/lado del usuario o cliente
function registrarCliente(req,res){
    var parametros = req.body;
    var usuarioModels = new Usuario();

    if({nombre:parametros.nombre,password:parametros.password,rol:parametros.rol}){
        usuarioModels.nombre = parametros.nombre;
        usuarioModels.password = parametros.password;
        usuarioModels.rol = 'ROL_USUARIO';

        Usuario.find({nombre:parametros.nombre},(err,clienteRegistrado)=>{
            if(clienteRegistrado.length == 0){
                bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                    usuarioModels.password = passwordEncriptada;
                    usuarioModels.save((err, clienteGuardado) => {
                        if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                        if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
                        return res.status(201).send({usuarios: clienteGuardado});
                })
                })
            }
        })

    }
}


//Registrar Usuario/ Lado del Admin
function registrarUsuario(req,res){
    var parametros = req.body; 
    var usuarioModels = new Usuario(); 

    if({nombre:parametros.nombre,password:parametros.password,rol:parametros.rol}){
        usuarioModels.nombre = parametros.nombre; 
        usuarioModels.password = parametros.password; 
        usuarioModels.rol = parametros.rol; 

            Usuario.find({nombre:parametros.nombre},(err,clienteRegistrado)=>{
                if(clienteRegistrado.length == 0){
                    bcrypt.hash(parametros.password, null,null, (err, passwordEncriptada)=>{
                        usuarioModels.password = passwordEncriptada;
                        usuarioModels.save((err, clienteGuardado) => {
                            if(err) return res.status(500).send({mensaje: 'No se realizo la accion'});
                            if(!clienteGuardado) return res.status(404).send({mensaje: 'No se agrego al usuario'});
                            return res.status(201).send({usuarios: clienteGuardado});
                    })
    
                })
            }else{
                return res.status(500).send({mensaje: 'Este correo, ya  se encuentra utilizado'});
            }
    
        })

    }
}

//Login 
function login(req, res) {
    var parametros = req.body;
    Usuario.findOne({ nombre : parametros.nombre }, (err, usuarioEncontrado)=>{
        if(err) return res.status(500).send({ mensaje: 'Error en la peticion' });
        if(usuarioEncontrado){
            bcrypt.compare(parametros.password, usuarioEncontrado.password, 
                (err, verificacionPassword)=>{//TRUE OR FALSE
                    if ( verificacionPassword ) {
                        if(parametros.obtenerToken === 'true'){
                            return res.status(200)
                                .send({ token: jwt.crearToken(usuarioEncontrado) })
                        } else {
                            usuarioEncontrado.password = undefined;
                            return  res.status(200)
                                .send({ usuario: usuarioEncontrado })
                        }
                    } else {
                        return res.status(500)
                            .send({ mensaje: 'Las contrasena no coincide'});
                    }
                })

        } else {
            return res.status(500)
                .send({ mensaje: 'Error, el correo no se encuentra registrado.'})
        }
    })
}



//Editar Usuario / Lado del Admin 
function editarUsuario(req,res){
    var usuarioID = req.params.idUsuario;
    var parametros = req.body; 

    if(req.user.rol = 'ROL_ADMINISTRADOR'){
        Usuario.findById(usuarioID,(err,clienteEditado)=>{
            if(clienteEditado.rol == 'ROL_USUARIO'){
                Usuario.findByIdAndUpdate({ _id: usuarioID, nombre : parametros.nombre,password: parametros.password, rol: parametros.rol }, parametros,
                    { new: true }, (err, usuarioActualizado) => {
                        if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                        if (!usuarioActualizado) return res.status(404).send({ mensaje: 'No se edito al usuario' });
                        return res.status(200).send({ usuario: usuarioActualizado });
                    });

            }else{
                return res.status(500).send({ mensaje: "Administradores no se editan" })
            }
        })
     
    }

}

//Editar Cliente de parte del propio Cliente/ Lado del Cliente
function editarCuenta(req,res){
    var usuarioID = req.params.idUsuario; 
    var parametros = req.body; 

    if ( usuarioID !== req.user.sub ) return res.status(500).send({ mensaje: 'No puede editar otros usuarios'});

    Usuario.findByIdAndUpdate({_id:usuarioID},parametros,{new:true},(err,CuentaEditada)=>{
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!CuentaEditada) return res.status(404).send({mensaje:'Error en editar la cuenta'});

        return res.status(500).send({usuario:CuentaEditada});
    })
}


//Eliminar Usuario/Lado del admin
function eliminarUsuario(req,res){
    var usuarioID = req.params.idUsuario; 
    var parametros = req.body; 

    if(req.user.rol == 'ROL_ADMINISTRADOR'){
       Usuario.findById(usuarioID,(err,clienteEliminado)=>{
           if(clienteEliminado.rol == "ROL_USUARIO"){
            Usuario.findByIdAndDelete({ _id: usuarioID }, parametros, (err, UsuarioEliminado) => {
                if (err) return res.status(500).send({ mensaje: 'No se realizo la accion' });
                if (!UsuarioEliminado) return res.status(400).send({ mensaje: 'No se elimino el usuario' });
                return res.status(200).send({ usuarios: UsuarioEliminado });
            });

           }else{
            return res.status(500).send({mensaje:"Administradores no se eliminan"})
           }
       })     
    }
}


//Eliminar Cuenta / Lado del cliente
function eliminarCuenta(req,res){
    var usuarioID = req.params.idUsuario;
    var parametros = req.body;

    if ( usuarioID !== req.user.sub ) return res.status(500).send({ mensaje: 'No puede eliminar otros usuarios'});
    Usuario.findByIdAndDelete({ _id: usuarioID }, parametros, (err, cuentaEliminada) => {
        if(err) return res.status(500).send({mensaje:'Error en la peticion'});
        if(!cuentaEliminada) return res.status(404).send({mensaje:'Error en editar la cuenta'});
        return res.status(500).send({usuario:cuentaEliminada});
    })

}

module.exports ={
    registrarAdmin,
    registrarCliente,
    registrarUsuario,
    login,
    editarUsuario,
    editarCuenta,
    eliminarUsuario,
    eliminarCuenta
}