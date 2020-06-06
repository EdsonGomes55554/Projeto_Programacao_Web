"use strict";

const colecoes = require('./conexaoBanco').colecoes;

function perfilPerdido (email, especie, cor, porte, desc, local, data, foto){
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
    colecoes.sequencia.findOneAndUpdate({nome: "Perdidos"},{$inc: {"id" : 1}}, (err, res) =>{
        if(err !== null){
            console.log(err);
        }else{
            callback(res.value.id);
        }
    });
}
const PerdidoDAO = {};

PerdidoDAO.toObj = (resposta) => {
    const perdido = new perfilPerdido(
        resposta.email,
        resposta.especie,
        resposta.cor,
        resposta.porte,
        resposta.desc,
        resposta.local,
        resposta.data
    );
    return perdido;
}

PerdidoDAO.toJSON = (perdido) => {
    return{
        id : perdido.id,
        email: perdido.email,
        especie: perdido.especie,
        cor: perdido.cor,
        porte: perdido.porte,
        desc: perdido.desc,
        local: perdido.local,
        data: perdido.data,
        foto: null
    }
}

PerdidoDAO.inserir = (novoPerdido, callback) => {
    proximoID(resp =>{
        if(resp !== undefined){
            let perdidoComID = novoPerdido;
            perdidoComID.id = resp;
            colecoes.perdidos.insertOne(novoPerdido,(err, res)=>{
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

PerdidoDAO.buscar = (dados, callback) =>{
    colecoes.perdidos.find(dados).toArray((err, res)=>{
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

PerdidoDAO.remover = (dados, callback) => {
    colecoes.perdidos.deleteOne(dados,(err, res)=>{
        if(err !== null){
            callback(false);
        }else{
            callback(true);
        }
    });
}

module.exports = {
    perfilPerdido: perfilPerdido,
    PerdidoDAO : PerdidoDAO
}