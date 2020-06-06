"use strict";

const colecoes = require('./conexaoBanco').colecoes;

function perfilMatch (emailPerdido, perdidoId, emailEncontrado,encontradoId){
    this.emailPerdido = emailPerdido;
    this.perdidoId = perdidoId;
    this.emailEncontrado = emailEncontrado;
    this.encontradoId = encontradoId;
}

const MatchDAO = {};

MatchDAO.toObj = (resposta) => {
    const match = new perfilMatch(
        resposta.emailPerdido,
        resposta.perdidoId,
        resposta.emailEncontrado,
        resposta.encontradoId
    );
    return match;
}

MatchDAO.toJSON = (match) => {
    return{
        emailPerdido: match.emailPerdido,
        perdidoId: match.perdidoId,
        emailEncontrado: match.emailEncontrado,
        encontradoId: match.encontradoId
    }
}

MatchDAO.inserir = (novoMatch, callback) => {
    colecoes.matches.insertOne(novoMatch,(err, res)=>{
        if(err !== null){
            callback(false);
        }else{
            const match = MatchDAO.toObj(res.ops[0]);
            callback(match);
        }
    });
}

MatchDAO.buscar = (dados, callback) =>{
    colecoes.matches.find(dados).toArray((err, res)=>{
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

MatchDAO.remover = (dados, callback) => {
    colecoes.matches.deleteOne(dados,(err, res)=>{
        if(err !== null){
            callback(false);
        }else{
            callback(true);
        }
    });
}

MatchDAO.removerTodos = (dados, callback) => {
    colecoes.matches.deleteMany(dados,(err, res)=>{
        if(err !== null){
            callback(false);
        }else{
            callback(true);
        }
    });
}





module.exports = {
    perfilMatch: perfilMatch,
    MatchDAO : MatchDAO
}