"use strict";

const confDB = require('../config.json').db;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient (confDB.url, {useNewUrlParser: true, useUnifiedTopology: true});

let colecoes = {};

function conectar(callback){
    client.connect(err =>{
        if(err === null){
            const banco = client.db(confDB.banco);
            colecoes.usuarios = banco.collection(confDB.colecoes.Usuarios);
            if(callback !== undefined){
                callback();
            }
        }else{
            console.log("Não foi possivel se conectar ao banco.")
        }
    })
}

function desconectar(callback){
    if(client !== null && client.isConnected()){
        client.close(() => {
            if(callback !== undefined){
                callback();
            }
        });
    }
}

module.exports ={
    conectar:conectar,
    desconectar:desconectar,
    colecoes
}