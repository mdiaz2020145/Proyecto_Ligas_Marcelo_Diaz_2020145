//Importaciones 
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Liga = require('../models/liga.model');


function agregarLiga(req,res){
    var parametros = req.body; 
    var ligaModel = new Liga();

    if({nombreLiga:parametros.nombreLiga}){
        ligaModel.idUsuario = req.user.sub;
        ligaModel.nombreLiga = parametros.nombreLiga;

        Liga.find({nombreLiga:parametros.nombreLiga},(err,ligaEncontrada)=>{
            if(ligaEncontrada.length == 0){
                ligaModel.save((err,ligaGuardada)=>{
                    if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
                    if (!ligaGuardada) return res.status(404).send({ mensaje: "Error, no se agrego ninguna liga" });
        
                    return res.status(200).send({Liga:ligaGuardada})
                })
            }else{
                return res.status(500).send({mensaje: 'Esta liga ya existe'});
            }
        })

    }
}

function editarLiga(req,res){
    var idL = req.params.idLiga;
    var parametros = req.body;

    Liga.findOneAndUpdate({_id:idL,idUsuario:req.user.sub},parametros,{new:true},(err,ligaEditada)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!ligaEditada) return res.status(404).send({ mensaje: "Error, no se edito ninguna liga" });
        return res.status(200).send({Liga:ligaEditada})
    })
}

function eliminarLiga(req,res){
    var idL = req.params.idLiga;

    Liga.findOneAndDelete({_id:idL,idUsuario:req.user.sub},(err,ligaEliminada)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
        if (!ligaEliminada) return res.status(404).send({ mensaje: "Error, no se elimino ninguna liga" });
        return res.status(200).send({Liga:ligaEliminada})
    })
}

function obtenerLiga(req,res){
    var idL = req.params.idLiga;

    Liga.findOne({_id:idL,idUsuario:req.user.sub},(err,ligaEncontrada)=>{
        if (err) return res.status(500).send({ mensaje: "Error en la peticion" })
        if (!ligaEncontrada) return res.status(404).send({ mensaje: "Error, no se puede observar otras ligas de otros usuarios" });
        return res.status(200).send({Liga:ligaEncontrada})
    })
}



module.exports ={
    agregarLiga,
    editarLiga,
    eliminarLiga,
    obtenerLiga
}