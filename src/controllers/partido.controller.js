//Importaciones 
const express = require('express');
const bcrypt = require('bcrypt-nodejs');
const jwt = require('../services/jwt');
const Partido = require('../models/partido.model');
const Equipo = require('../models/equipo.model');
const ligaModel = require('../models/liga.model');
const underscore = require('underscore')

function agregarPartido(req,res){
    var parametros = req.body; 
    var partidoModel = new Partido();

    var jornadaMax;
    var partidoMax;

    var puntosEquipo1;
    var puntosEquipo2;


    if(parametros.golesDeEquipo1,parametros.golesDeEquipo2,parametros.jornada){
        partidoModel.golesDeEquipo1 = parametros.golesDeEquipo1;
        partidoModel.golesDeEquipo2 = parametros.golesDeEquipo2;
        partidoModel.jornada = parametros.jornada; 
        partidoModel.idPrimerEquipo = parametros.idPrimerEquipo;
        partidoModel.idSegundoEquipo = parametros.idSegundoEquipo;
        
        Partido.findOne({idPrimerEquipo:parametros.idPrimerEquipo,idSegundoEquipo:parametros.idSegundoEquipo,jornada:parametros.jornada},(err,partidoA)=>{
            if (err) return res.status(500).send({ mensaje: "Error en la peticion" });
            if(!partidoA >= 1){
                Equipo.find((err,equipoB)=>{
                    if(equipoB.length % 2 ==0){
                        //Par
                        partidoMax = equipoB.length /2;
                        jornadaMax = (equipoB.length -1)/2;
                    }else{
                        //Impar
                        partidoMax = (equipoB.length -1)/2;
                        jornadaMax = equipoB.length
                    }
                    if(parametros.jornada <= jornadaMax){
                        if(err) return res.status(500).send({mensaje:'No se realizo la accion'})
                        partidoModel.save((err,partidoC)=>{
                            if(parametros.golesDeEquipo1>parametros.golesDeEquipo2){
                                puntosEquipo1 = 3;
                                puntosEquipo2 =0;
                            }else if(parametros.golesDeEquipo1 == parametros.golesDeEquipo2){
                                puntosEquipo1 = 1;
                                puntosEquipo2 = 1;

                            }else{
                                puntosEquipo1=0;
                                puntosEquipo2=3;
                            }
                            Equipo.findOneAndUpdate({_id:parametros.idPrimerEquipo},{$inc:{golesAfavor:parametros.golesDeEquipo1,
                            golesEnContra:parametros.golesDeEquipo2,cantidadDePartidos:1,diferencia:parametros.golesDeEquipo1 - parametros.golesDeEquipo2,puntos:puntosEquipo1}},(err)=>{
                                 if (err) return res.status(500).send({ mensaje: "Error en el primer Equipo" })

                            Equipo.findOneAndUpdate({_id:parametros.idSegundoEquipo},{$inc:{golesAfavor:parametros.golesDeEquipo2,
                            golesEnContra:parametros.golesDeEquipo1,cantidadDePartidos:1,diferencia:parametros.golesDeEquipo2 - parametros.golesDeEquipo1,puntos:puntosEquipo2}},(err)=>{
                                if (err) return res.status(500).send({ mensaje: "Error en el segundo Equipo" });
                            })
                                
                            })
                            return res.status(200).send({partido:partidoC})
                        })
                    }else{
                        return res.status(500).send({mensaje:'La jornada es mayor a las disponibles'})
                    }
                })
            }else{
                return res.status(500).send({mensaje: 'Este partido ya existe'});
            }

        })
    }else{
        return res.status(500).send({ mensaje: "Llene todos los campos para continuar" });
    }
}

function crearReporte(req,res){
    var idLiga = req.params.idLiga;

    ligaModel.findOne({_id:idLiga},(err, LigaEncontrada)=>{
        Equipo.find({idLiga: LigaEncontrada._id, idUsuario:req.user.sub},(err,equipoEncontrado)=>{
    const fs = require('fs');
    const pdfmake = require('pdfmake');

    var fonts ={
        Roboto:{
            normal:'./fonts/Roboto/Roboto-Regular.ttf',
            bold: './fonts/Roboto/Roboto-Medium.ttf',
            italics: './fonts/Robot/Roboto-Italic.ttf',
            bolditalics: './fonts/Roboto/Roboto-MediumItalic.ttf'
        }

    };

    let pdf = new pdfmake(fonts);

    let content =[{
        text: 'Liga:'+LigaEncontrada.nombreLiga,
        alignment: 'center',
        fontSize: 25,
        color: '#000000',
        bold: true,
        margin: [0, 0, 0, 20]
    }]

    var equipo = new Array('Posicion del equipo','Equipo','favor','EnContra','diferencia','puntos','cantidad')

    var body= []

    body.push(equipo)

    for (let i = 0; i < equipoEncontrado.length; i++) {
        var datosEquipos = new Array((i + 1), equipoEncontrado[i].nombreEquipo, equipoEncontrado[i].golesAfavor, 
        equipoEncontrado[i].golesEnContra, equipoEncontrado[i].diferencia, equipoEncontrado[i].puntos, equipoEncontrado[i].cantidadDePartidos)
        body.push(datosEquipos)
    }

    content.push({
        text: ' ',
        margin: [0, 0, 0, 10]
    })

    content.push({

        table: {
            heights: 60,
            headerRows: 1,
            widths: ['*', '*', '*', '*', '*', '*', '*'],
            body: body
        },
        margin: [0, 0, 0, 10]
    })


    let docDefinition ={
        content : content,
    }

    let pdfDocumento = pdf.createPdfKitDocument(docDefinition,{});
    pdfDocumento.pipe(fs.createWriteStream('reporteLiga.pdf'));
    pdfDocumento.end();
    return res.status(200).send({mensaje:'El pdf esta creado'});

    }).sort({
    puntos:-1
    })

})
    
}

module.exports ={
    agregarPartido,
    crearReporte
}