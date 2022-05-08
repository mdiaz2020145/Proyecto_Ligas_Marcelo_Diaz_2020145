//Importaciones 
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Equipo = require('../models/equipo.model');
const Liga = require('../models/liga.model');

function agregarEquipo(req,res){
    var parametros = req.body; 
    var EquipoModel = new Equipo();

    if({nombreEquipo:parametros.nombreEquipo,golesAfavor:parametros.golesAfavor,
        golesEnContra:parametros.golesEnContra,diferencia:parametros.diferencia,puntos:parametros.puntos}){

        EquipoModel.nombreEquipo = parametros.nombreEquipo;
        EquipoModel.golesAfavor = 0;
        EquipoModel.golesEnContra = 0;
        EquipoModel.diferencia = 0;
        EquipoModel.puntos = 0; 
        EquipoModel.cantidadDePartidos = 0;
        EquipoModel.idUsuario = req.user.sub; 
        EquipoModel.idLiga = parametros.idLiga;
            
        Equipo.find({nombreEquipo:parametros.nombreEquipo},(err,equipoGuardado)=>{
            Equipo.find({idLiga:parametros.idLiga},(err,equipo)=>{
                if(equipo.length >= 10){
                    return res.status(500).send({mensaje:'La liga solo admite 10 equipos'})
                }else{
                    if(equipoGuardado.length == 0){
                        EquipoModel.save((err,equipoGuardado)=>{
                            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                            if (!equipoGuardado) return res.status(404).send({ mensaje: "Error, no se agrego ningun equipo" });
                            return res.status(200).send({Equipo:equipoGuardado})
                        })
        
                    }else{
                        return res.status(500).send({mensaje: 'Este equipo ya existe'});
                    }
                }
            })

        })    

    }

}

function editarEquipo(req,res){
    var idE = req.params.idEquipo; 
    var parametros = req.body;

    Equipo.findOneAndUpdate({_id:idE,idUsuario:req.user.sub},parametros,{new:true},(err,equipoEditado)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!equipoEditado) return res.status(404).send({ mensaje: "Error, no se edito ningun Equipo" });
        return res.status(200).send({Equipo:equipoEditado})
    })

}

function eliminarEquipo(req,res){
    var idE = req.params.idEquipo; 

    Equipo.findOneAndDelete({_id:idE,idUsuario:req.user.sub},(err,equipoEliminado)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!equipoEliminado) return res.status(404).send({ mensaje: "Error, no se elimino ningun Equipo" });
        return res.status(200).send({Equipo:equipoEliminado})    

    })

}

function obtenerEquipo(req,res){
    var idE = req.params.idEquipo;

    Equipo.findOne({_id:idE,idUsuario:req.user.sub},(err,equipoEncontrado)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!equipoEncontrado) return res.status(404).send({ mensaje: "Error, no se encontro ningun Equipo" });
        return res.status(200).send({Equipo:equipoEncontrado}) 

    })

}

function obtenerEquipoPorLiga(req, res){
    var idLiga = req.params.idLiga;

    ligaModel.findOne({_id:idLiga},(err, LigaEncontrada)=>{
        if(err) return res.status(500).send({ mensaje: "Error en la peticion"});
        if(!LigaEncontrada) return res.status(404).send({mensaje : "Error, no se encuentran categorias con ese id"});

        Equipo.find({idLiga: LigaEncontrada._id, idUsuario:req.user.sub},(err,equipoEncontrado)=>{
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if (!equipoEncontrado) return res.status(500).send({ mensaje: 'Error al encontrar el equipo' });
            return res.status(200).send({ Liga: equipoEncontrado})
        }).sort({
            puntos:-1
        })

    })

}

module.exports ={
    agregarEquipo,
    editarEquipo,
    eliminarEquipo,
    obtenerEquipo,
    obtenerEquipoPorLiga
}