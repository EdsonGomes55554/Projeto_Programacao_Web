"use strict";

const colecoes = require('./conexaoBanco').colecoes;

function perfilEncontrado (email, especie, cor, porte, desc, local, data, foto){
    this.id = null;
    this.email = email;
    this.especie = especie,
    this.cor = cor;
    this.porte = porte;
    this.desc = desc;
    this.local = local;
    this.data = data;
    this.foto = foto;
}

function proximoID(callback){
    colecoes.sequencia.findOneAndUpdate({nome: "Encontrados"},{$inc: {"id" : 1}}, (err, res) =>{
        if(err !== null){
            console.log(err);
        }else{
            callback(res.value.id);
        }
    });
}

const EncontradoDAO = {};

EncontradoDAO.toObj = (resposta) => {
    const encontrado = new perfilEncontrado(
        resposta.email,
        resposta.especie,
        resposta.cor,
        resposta.porte,
        resposta.desc,
        resposta.local,
        resposta.data
    );
    return encontrado;
}

EncontradoDAO.toJSON = (encontrado) => {
    return{
        email: encontrado.email,
        especie: encontrado.especie,
        cor: encontrado.cor,
        porte: encontrado.porte,
        desc: encontrado.desc,
        local: encontrado.local,
        data: encontrado.data,
        foto: null
    }
}

EncontradoDAO.inserir = (novoEncontrado, callback) => {
    proximoID(resp =>{
        if(resp !== undefined){
            let encontradoComID = novoEncontrado;
            encontradoComID.id = resp;
            colecoes.encontrados.insertOne(novoEncontrado,(err, res)=>{
                if(err !== null){
                    callback(false);
                }else{
                    callback(true);
                }
            });
        }else{
            callback(false);
        }
    });
}

EncontradoDAO.remover = (dados, callback) => {
    colecoes.encontrados.deleteOne(dados,(err, res)=>{
        if(err !== null){
            callback(false);
        }else{
            callback(true);
        }
    });
}

EncontradoDAO.buscar = (dados, callback) =>{
    colecoes.encontrados.find(dados).toArray((err, res)=>{
        if(err !== null){
            callback(false);
        }else{
            if(res.length > 0){
                callback(res);
            }else{
                callback(false);
            }
        }
    });
}

module.exports = {
    perfilEncontrado: perfilEncontrado,
    EncontradoDAO : EncontradoDAO
}