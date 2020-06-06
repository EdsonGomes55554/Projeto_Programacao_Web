"use strict";

const confMaps = require('../config.json').googleMaps;
const modeloMatch = require('../models/matches-model');
const modeloPerdido = require('../models/perdidos-model');
const modeloEncontrado = require('../models/encontrados-model');
const {Client, Status} = require("@googlemaps/google-maps-services-js");
const client = new Client({});

function matchingEncontrado(perfilEncontrado) {
    let query = {};
    modeloPerdido.PerdidoDAO.buscar(query, (resultado) => {
        if (resultado != false) {
            resultado.forEach(perdido => {
                if(perdido.especie == perfilEncontrado.especie && 
                   perdido.cor == perfilEncontrado.cor &&
                   perdido.porte == perfilEncontrado.porte) {
                        calcularDist(perdido.local, perfilEncontrado.local, (dist) => {
                            if(dist != -1) {
                                if(dist <= 7000) {
                                    registrarMatch(perdido.email, perdido.id, perfilEncontrado.email, perfilEncontrado.id);
                                }
                            } else {
                                registrarMatch(perdido.email, perdido.id, perfilEncontrado.email, perfilEncontrado.id);
                            }
                        });
                   }
            });
        }
    });
}

function matchingPerdido(perfilPerdido) {
    let query = {};
    modeloEncontrado.EncontradoDAO.buscar(query, (resultado) => {
        if (resultado != false) {
            resultado.forEach(encontrado => {
                if(encontrado.especie == perfilPerdido.especie && 
                   encontrado.cor == perfilPerdido.cor &&
                   encontrado.porte == perfilPerdido.porte) {
                        calcularDist(encontrado.local, perfilPerdido.local, (dist) => {
                            if(dist != -1) {
                                if(dist <= 7000) {
                                    console.log(encontrado.id);
                                    registrarMatch(perfilPerdido.email, perfilPerdido.id, encontrado.email, encontrado.id);
                                }
                            } else {
                                registrarMatch(perfilPerdido.email, perfilPerdido.id, encontrado.email, encontrado.id);
                            }
                        });
                   }
            });
        }
    });
}

function registrarMatch(emailPerdido, idPerdido, emailEncontrado, idEncontrado) {
    console.log(idEncontrado);
    let match = new modeloMatch.perfilMatch ( emailPerdido,
                                              idPerdido,
                                              emailEncontrado,
                                              idEncontrado);
    modeloMatch.MatchDAO.inserir(match, (res) => {
        if (res == false) {
            console.log("Não foi possível inserir o match");
        }
    });
}

function calcularDist(local1, local2, callback) {
    client.distancematrix({
        params: {
            destinations: [local1],
            origins: [local2],
            key: confMaps.apiKey
        }, 
        timeout: 2000
    }).then((res) => {
        if(res.data.rows[0].elements[0].status == 'ZERO_RESULTS') {
            callback(-1);
        } else {
            callback(res.data.rows[0].elements[0].distance.value);
        }
    }).catch((err) => {
        callback(-1);
    });
}

module.exports ={
    matchingEncontrado: matchingEncontrado,
    matchingPerdido: matchingPerdido
}