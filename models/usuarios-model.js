"use strict";

const colecoes = require('./conexaoBanco').colecoes;

function perfilUsuario(nome, telefone, email, senha, medalhas){
    this.nome = nome;
    this.telefone = telefone;
    this.email = email;
    this.senha = senha;
    this.medalhas = medalhas;
}

function procurarEmailUnico(emailReq, callback){
    colecoes.usuarios.find({ email: emailReq }).toArray((err,result)=>{
        if (err !== null){
            console.log("Não foi possivel pesquisar por email unico.");
            callback(false);
        }else{ 
            if(result.length > 0){
                callback(false);
            }else{
                callback(true);
            }
        }
    });
}

const UsuarioDAO = {};

UsuarioDAO.inserir = (novoPerfil, callback) => {
    procurarEmailUnico(novoPerfil.email, (status) => {
        if(status === true){
            colecoes.usuarios.insertOne(novoPerfil, (err,res)=> {
                if(err === null){
                    const perfil = new perfilUsuario (res.nome,
                                                      res.telefone,
                                                      res.email,
                                                      res.senha,
                                                      res.medalhas);
                    callback(perfil);
                }else{
                    console.log("Erro na inserção");
                    callback(false)
                }
            });
        }else{
            console.log("Ja existe esse Email no banco.");
            callback(false);
        }
    });
}

UsuarioDAO.buscarUsuario = (senha, email, callback) => {
    let dados = { email: email,
                  senha: senha };
    colecoes.usuarios.find(dados).toArray((err, res) => {
        if(err !== null){
            callback(false);
            console.log("Não foi possivel buscar o Usuario.")
        }else{
            if(res.length > 0){
                callback(res[0]);
            }else{
                callback(false);
            }
        }
    });
}

module.exports = {
    perfilUsuario: perfilUsuario,
    UsuarioDAO : UsuarioDAO
}

/*
function proximoID(callback){
    const sequencia = banco.collection(confDB.colecoes.Sequencias);
    sequencia.findOneAndUpdate({nome: "Usuarios"},{$inc: {"valor" : 1}}, (err, res) =>{
        if(err !== null){
            console.log(err);
        }else{
            callback(res.value.valor);
        }
    });
}

UsuarioDAO.inserir = (perfilUsuario, callback) =>{
    proximoID(id =>{
        if(id == null){
            console.log("Falha na criação do id.")
            callback(false);
        }else{
            perfilUsuario.userID = id;
            usuarios.insertOne(perfilUsuario, (err,res) => {
                if(err === null){
                    callback(true);
                }else{
                    console.log("Erro na inserção");
                    callback(false)
                }
            });
        }
    });
}*/