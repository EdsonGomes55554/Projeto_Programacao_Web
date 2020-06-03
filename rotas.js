const rotas = require('express').Router();
const usuarioController = require('./controller/usuarios-controller');
const bodyParser = require('body-parser');
rotas.use(bodyParser.urlencoded({extended: true}));

rotas.get("/", (req,res) =>{
    res.render('home');
});


rotas.get("/perdidos", (req,res) =>{
    res.render('perdidos');
});


function authenticate(req, res, next) {
    if (req.session.autenticado == true){
        next();
    }else{
        res.redirect('/login');
    }
}

rotas.get("/cadastro", usuarioController.renderizarCadastro);
rotas.post("/cadastro", usuarioController.consistenciaCadastro);

rotas.get("/login", usuarioController.renderizarLogin);
rotas.post("/login", usuarioController.verificaLogin);

rotas.get("/perfil", authenticate, (req,res) =>{
    res.render('perfil');
});

rotas.get("/logout", usuarioController.deslogar);


module.exports = rotas