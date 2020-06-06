"use strict";

const modeloUsuario = require('../models/usuarios-model');
const modeloPerdido = require('../models/perdidos-model');
const modeloEncontrado = require('../models/encontrados-model');
const modeloMatch = require('../models/matches-model');
const fs = require('fs');
const path = require('path');

function renderizarCadastro(req, res){
    res.render('cadastro');
}

function consistenciaCadastro(req, res){
    let sucesso = false, falha = false, error = false;
    if (req.body.senha === req.body.confirmeSenha) {
        const perfil= new modeloUsuario.perfilUsuario(  req.body.nome, 
                                                        req.body.telefone,
                                                        req.body.email,
                                                        req.body.senha,
                                                        {"emblemaCasoResolvido": false,
                                                         "emblemaSalvadorDePets": false})
        modeloUsuario.UsuarioDAO.inserir(perfil, (err) =>{
            if(err !== false) {
                sucesso = true;
            }else{
                error = true;
            }
            res.render('cadastro', {sucesso: sucesso, falha:falha, error:error});
        });                
    } else {
        falha = true;
        res.render('cadastro', {sucesso: sucesso, falha:falha, error:error});
    }
}

function consistenciaCadastroHome(req, res){
    let sucesso = false, falha = false, error = false;
    if (req.body.senha === req.body.confirmeSenha) {
        const perfil= new modeloUsuario.perfilUsuario(  req.body.nome, 
                                                        req.body.telefone,
                                                        req.body.email,
                                                        req.body.senha,
                                                        {"emblemaCasoResolvido": false,
                                                         "emblemaSalvadorDePets": false})
        modeloUsuario.UsuarioDAO.inserir(perfil, (err) =>{
            if(err !== false) {
                sucesso = true;
                res.render('home', {sucesso: sucesso, falha:falha, error:error});
            }else{
                error = true;
                res.render('cadastro', {sucesso: sucesso, falha:falha, error:error});
            }
        });                
    } else {
        falha = true;
        res.render('cadastro', {sucesso: sucesso, falha:falha, error:error});
    }
}

function removerAnimal(req, res) {
    removerTodosOsMatches(req, (resp) => {
        if (resp !== false) {
            if (req.query.classe == "perdidos") {
                modeloPerdido.PerdidoDAO.remover({id: Number.parseInt(req.query.id)}, (resp) => {
                    if(resp !== false) {
                        res.render("perfil",  {usuario: req.session.usuario, animais:true, sucesso:true});
                    } else {
                        res.render("perfil",  {usuario: req.session.usuario, animais:true, falha:true});
                    }
                });
            } else {
                modeloEncontrado.EncontradoDAO.remover({id: Number.parseInt(req.query.id)}, (resp) => {
                    if(resp !== false) {
                        res.render("perfil",  {usuario: req.session.usuario, animais:true, sucesso:true});
                    } else {
                        res.render("perfil",  {usuario: req.session.usuario, animais:true, falha:true});
                    }
                });
            }
        } else {
            res.render("perfil",  {usuario: req.session.usuario, animais:true, falha:true});
        }
    });
}

function removerTodosOsMatches(req, callback) {
    let query = {};
    if(req.query.classe == "perdidos") {
        query = {perdidoId: Number.parseInt(req.query.id)};
    } else {
        query = {encontradoId: Number.parseInt(req.query.id)};
    }
    modeloMatch.MatchDAO.removerTodos(query, (resp) => {
        if(resp !== false) {
            callback(true);
        } else {
            callback(false);
        }
    });   
}

function removerMatch(req, res) {
    let query = {emailPerdido: req.query.emailPerdido,
                 perdidoId: Number.parseInt(req.query.perdidoId),
                 emailEncontrado: req.query.emailEncontrado,
                 encontradoId: Number.parseInt(req.query.encontradoId)};
    modeloMatch.MatchDAO.removerTodos(query, (resp) => {
        if(resp !== false) {
            res.render("perfil",  {usuario: req.session.usuario, matches:true, sucesso:true});
        } else {
            res.render("perfil",  {usuario: req.session.usuario, matches:true, falha:true});
        }
    });
}

function resolverMatch(req, res) {
    let dados = {email: req.query.emailPerdido};
    darMedalhaCasoResolvido(req, dados, (resp1) => {
        dados = {email: req.query.emailEncontrado};
        darMedalhaCasoResolvido(req, dados, (resp2) => {
            darMedalhaSalvadorDePets(req, dados, (resp3) => {
                    dados = {id: Number.parseInt(req.query.perdidoId)};
                    req.query.id = req.query.perdidoId;
                    req.query.classe = "perdidos";
                    removerTodosOsMatches(req, (resp4) => {
                        modeloPerdido.PerdidoDAO.remover(dados, (resp5) => {
                            dados = {id: Number.parseInt(req.query.encontradoId)};
                            req.query.id = req.query.encontradoId;
                            req.query.classe = "encontrados";
                            removerTodosOsMatches(req, (resp6) => {
                                modeloEncontrado.EncontradoDAO.remover(dados, (resp7) => {
                                    dados = {perdidoId: Number.parseInt(req.query.perdidoId),
                                             encontradoId: Number.parseInt(req.query.encontradoId),
                                             emailPerdido: req.query.emailPerdido,
                                             emailEncontrado: req.query.emailEncontrado};
                                    modeloMatch.MatchDAO.removerTodos(dados, (resp8) => {
                                        if(resp8 !== false) {
                                            req.session.usuario.medalhas.emblemaCasoResolvido = true;
                                            res.render("perfil",  {usuario: req.session.usuario, matches:true, sucesso:true});
                                        } else {
                                            res.render("perfil",  {usuario: req.session.usuario, matches:true, falha:true});
                                        }
                                    })
                                });
                            });
                        });
                    })
                    
            })
        });
    });
    
}

function darMedalhaCasoResolvido(req, dados, callback) {
    modeloUsuario.UsuarioDAO.buscarUsuario(dados, (usuario) => {
        let novosDados = {medalhas: {emblemaCasoResolvido: true,
                                     emblemaSalvadorDePets: usuario.medalhas.emblemaSalvadorDePets}};
        modeloUsuario.UsuarioDAO.atualizaUsuario(dados, novosDados, (resp) => {
            callback(resp);
        });
    });
}

function darMedalhaSalvadorDePets(req, dados, callback) {
    modeloUsuario.UsuarioDAO.buscarUsuario(dados, (usuario) => {
        let novosDados = {medalhas: {emblemaCasoResolvido: usuario.medalhas.emblemaCasoResolvido,
                                     emblemaSalvadorDePets: true}};
        modeloUsuario.UsuarioDAO.atualizaUsuario(dados, novosDados, (resp) => {
            callback(resp);
        });
    });
}

function renderizarLogin(req, res){
    res.render('login');
}

function verificaLogin(req, res){
    modeloUsuario.UsuarioDAO.buscarUsuario({email:req.body.email,
                                            senha:req.body.senha}, (resp) =>{
        if(resp === false){
            req.session.autenticado = false;
            req.session.usuario = null;
            res.render('login', {falha : true});
        }else{
            req.session.autenticado = true;
            req.session.usuario = resp;
            res.redirect('/');
        }
    })
}


function entrarRegistrar(req,res){
    res.render('perfil', {usuario: req.session.usuario, registrar: true});
}

function entrarConfiguracao(req,res){
    res.render('perfil', {usuario: req.session.usuario, configuracao: true});
}

function entrarAnimais(req,res){
    let query = {email: req.session.usuario.email};
    modeloPerdido.PerdidoDAO.buscar(query, (perdidos) => {
        modeloEncontrado.EncontradoDAO.buscar(query, (encontrados) => {
            res.render('perfil', {usuario: req.session.usuario, animais: true, perdidos: perdidos, encontrados: encontrados});
        });
    });
}

function entrarMatches(req,res){
    let query = {emailPerdido: req.session.usuario.email};
    modeloMatch.MatchDAO.buscar(query, (matches) => {
        let encontrados = [];
        if(matches != false) {
            matches.forEach(match => {
                query = {id: match.encontradoId};
                modeloEncontrado.EncontradoDAO.buscar(query, (animais) => {
                    if(animais != false) {
                        let encontrado = animais.pop();
                        encontrado.encontradoId = match.encontradoId;
                        encontrado.perdidoId = match.perdidoId;
                        encontrado.emailEncontrado = match.emailEncontrado;
                        encontrado.emailPerdido = match.emailPerdido;
                        encontrados.push(encontrado);
                    }
                    if(encontrados.length == matches.length) {
                        res.render('perfil', {usuario: req.session.usuario, matches: true, encontrados: encontrados});
                    }
                });
            });

        } else {
            res.render('perfil', {usuario: req.session.usuario, matches: true, encontrados: encontrados});
        }
    });
}

function updateNome(req,res){
    modeloUsuario.UsuarioDAO.atualizaUsuario({email: req.session.usuario.email,
                                              senha: req.body.senhaAlterarNome},
                                              {nome: req.body.alterarNome}, (resp)=>{
        if(resp !== false){
            req.session.usuario.nome =  req.body.alterarNome;
            res.render("perfil", {usuario: req.session.usuario, configuracao: true, sucesso: true});
        }else{
            res.render("perfil", {usuario: req.session.usuario, configuracao: true, falha: true});
        }
    });
}

function updateTelefone(req,res){
    modeloUsuario.UsuarioDAO.atualizaUsuario({email: req.session.usuario.email,
                                              senha: req.body.senhaAlterarTelefone},
                                              {telefone: req.body.alterarTelefone}, (resp)=>{
        if(resp !== false){
            res.render("perfil", {usuario: req.session.usuario, configuracao: true, sucesso: true});
        }else{
            res.render("perfil", {usuario: req.session.usuario, configuracao: true, falha: true});
        }
    });
}

function updateSenha(req,res){
    modeloUsuario.UsuarioDAO.atualizaUsuario({email: req.session.usuario.email,
                                              senha: req.body.senhaAlterarSenha},
                                              {senha: req.body.alterarSenha}, (resp)=>{
        if(resp !== false){
            res.render("perfil", {usuario: req.session.usuario, configuracao: true, sucesso: true});
        }else{
            res.render("perfil", {usuario: req.session.usuario, configuracao: true, falha: true});
        }
    });
}

function updateFoto(req, res) {
    if (req.files["alterarFoto"] == undefined) {
        console.log("Não é uma foto");
    } else {
        salvarFoto(req.files["alterarFoto"].pop(), (caminho) => {
            if(caminho != null) {
                modeloUsuario.UsuarioDAO.atualizaUsuario({email: req.session.usuario.email,
                                                            senha: req.fields.senhaAlterarFoto.pop()},
                                                            {foto: caminho}, (resp) => {
                        if(resp !== false){
                            req.session.usuario.foto = caminho;
                            res.render("perfil", {usuario: req.session.usuario, configuracao: true, sucesso: true});
                        }else{
                            res.render("perfil", {usuario: req.session.usuario, configuracao: true, falha: true});
                        }
                    });
            }
            
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

function deslogar(req,res){
    if(req.session.autenticado === true){
        req.session.autenticado = false;
        req.session.usuario = null;
    }
    res.redirect('/');
}

module.exports ={
    consistenciaCadastroHome: consistenciaCadastroHome,
    consistenciaCadastro : consistenciaCadastro,
    renderizarCadastro : renderizarCadastro,
    verificaLogin : verificaLogin,
    renderizarLogin : renderizarLogin,
    deslogar: deslogar,
    entrarRegistrar: entrarRegistrar,
    entrarConfiguracao: entrarConfiguracao,
    entrarAnimais: entrarAnimais,
    entrarMatches: entrarMatches,
    updateNome: updateNome,
    updateTelefone:updateTelefone,
    updateSenha: updateSenha,
    updateFoto: updateFoto,
    removerAnimal: removerAnimal,
    removerMatch: removerMatch,
    resolverMatch: resolverMatch
}