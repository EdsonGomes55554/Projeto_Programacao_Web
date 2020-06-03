"use strict";

const modeloUsuario = require('../models/usuarios-model');

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
                                                        []  )
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

function renderizarLogin(req, res){
    res.render('login');
}

function verificaLogin(req, res){
    modeloUsuario.UsuarioDAO.buscarUsuario(req.body.senha, req.body.email, (resp) =>{
        if(resp === false){
            req.session.autenticado = false;
            res.render('login', {falha : true});
        }else{
            console.log("login realidado com sucesso.");
            req.session.autenticado = true;
            res.redirect('/');
        }
    })
}

function deslogar(req,res){
    if(req.session.autenticado === true){
        req.session.autenticado = false;
    }
    res.redirect('/');
}

module.exports ={
    consistenciaCadastro : consistenciaCadastro,
    renderizarCadastro : renderizarCadastro,
    verificaLogin : verificaLogin,
    renderizarLogin : renderizarLogin,
    deslogar: deslogar
}