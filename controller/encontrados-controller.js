"use strict";

const confMaps = require('../config.json').googleMaps;
const modeloEncontrado = require('../models/encontrados-model');
const matchCotroller = require('../controller/matches-controller');
const fs = require('fs');
const path = require('path');

let raca = [];
let cor = [];
let porte = [];

function renderizarEncontrados(req, res) {
    renderizarEspecie(res, "cachorro");
}

function cadastrarEncontrado(req, res){
    if (req.files["foto"] == undefined) {
        console.log("Não é uma foto");
    } else {
        salvarFoto(req.files["foto"].pop(), (caminho) => {
            if(caminho != null) {
                const encontrado = new modeloEncontrado.perfilEncontrado(req.session.usuario.email,
                                    req.fields.especie.pop(),
                                    req.fields.cor.pop(),
                                    req.fields.porte.pop(),
                                    req.fields.desc.pop(),
                                    req.fields.localizacao.pop(),
                                    req.fields.data.pop(),
                                    caminho);
                modeloEncontrado.EncontradoDAO.inserir(encontrado, (resp) => {
                    if(resp === false){
                        res.render("perfil", {usuario: req.session.usuario, registrar:true, falha:true});
                    }else{
                        matchCotroller.matchingEncontrado(encontrado);
                        res.render("perfil", {usuario: req.session.usuario, registrar:true, sucesso:true});
                    }
                });
            } else {
                res.render("perfil", {usuario: req.session.usuario, registrar:true, falha:true});
            }
        });
    }
}

function renderizarEspecie(res, especie) {
    let query = {especie: especie};
    modeloEncontrado.EncontradoDAO.buscar(query, (animais) => {
        vetoresUnicos(animais);
        let cachorroSelecionado = especie == "cachorro";
        res.render("encontrados", {cachorroSelecionado: cachorroSelecionado,
                                animais: animais,
                                raca: raca,
                                cor: cor,
                                porte: porte,
                                apiKey: confMaps.apiKey});
    });
}

function mudarEspecie(req, res) {
    if(req.body.cachorro) {
        renderizarEspecie(res, "cachorro");
    } else if (req.body.gato) {
        renderizarEspecie(res, "gato");
    }
}

function filtrarEncontrados(req, res) {
    let valorEspecie = "gato";
    if(req.query.optionsCachorro == "on") {
        valorEspecie = "cachorro";
    }

    let query = {especie: valorEspecie};

    modeloEncontrado.EncontradoDAO.buscar(query,(animais) => {
        let newAnimais = [];
        let valorRaca = req.query.selectRaca;
        let valorCor = req.query.selectCor;
        let valorPorte = req.query.selectPorte;
        animais.forEach(animal => {
            if(valorRaca == null || valorRaca == animal.raca) {
                if(valorCor == null || valorCor == animal.cor) {
                    if(valorPorte == null || valorPorte == animal.porte) {
                        newAnimais.push(animal);
                    }
                }
            }
        })
        
        vetoresUnicos(animais);
        res.render("encontrados", {cachorroSelecionado: valorEspecie == "cachorro",
                                animais: newAnimais,
                                raca: raca,
                                cor: cor,
                                porte: porte,
                                apiKey: confMaps.apiKey});
    });
}


function separador(vetor, dado){
    if(vetor.indexOf(dado) == -1){
        vetor.push(dado);
    }
}

function vetoresUnicos(dados){
    raca = [];
    cor = [];
    porte = [];
    if(dados != false) {
        dados.forEach(animal =>{
            separador(raca, animal.raca);
            separador(cor, animal.cor);
            separador(porte, animal.porte);
        });
    }
}

function salvarFoto(arquivo, callback) {
    const nomeArquivo = path.basename(arquivo.path);
    let novoCaminho = path.join(global.__rootdir, "updates", nomeArquivo);

    fs.copyFile(arquivo.path, novoCaminho, err => {
        if (err) {
            callback(null);
        } else {
            callback(nomeArquivo);
        }
    });
}

module.exports ={
    renderizarEncontrados : renderizarEncontrados,
    filtrarEncontrados: filtrarEncontrados,
    cadastrarEncontrado: cadastrarEncontrado,
    mudarEspecie: mudarEspecie
}