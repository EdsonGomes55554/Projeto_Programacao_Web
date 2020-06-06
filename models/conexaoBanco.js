"use strict";

const confDB = require('../config.json').db;
const MongoClient = require('mongodb').MongoClient;
const client = new MongoClient (confDB.url, {useNewUrlParser: true, useUnifiedTopology: true});
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const sessionStore = new MongoDBStore({
    uri: confDB.url,
    databaseName: confDB.banco,
    collection: confDB.colecoes.Sessoes
});

let colecoes = {};

function conectar(callback){
    client.connect(err =>{
        if(err === null){
            const banco = client.db(confDB.banco);
            colecoes.usuarios = banco.collection(confDB.colecoes.Usuarios);
            colecoes.sequencia = banco.collection(confDB.colecoes.Sequencias);
            colecoes.perdidos = banco.collection(confDB.colecoes.Perdidos);
            colecoes.encontrados = banco.collection(confDB.colecoes.Encontrados);
            colecoes.matches = banco.collection(confDB.colecoes.Matches);
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
    colecoes,
    sessionStore
}