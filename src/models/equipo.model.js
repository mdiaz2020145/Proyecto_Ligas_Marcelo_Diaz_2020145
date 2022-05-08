const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const EquipoSchema = Schema({
    nombreEquipo:String,
    golesAfavor:Number,
    golesEnContra:Number,
    diferencia:Number,
    puntos:Number,
    cantidadDePartidos:Number,
    idUsuario:{ type: Schema.Types.ObjectId, ref:'Usuarios'},
    idLiga:{type:Schema.Types.ObjectId, ref:'Ligas'}
});

module.exports = mongoose.model('Equipos',EquipoSchema);