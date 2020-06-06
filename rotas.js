const rotas = require('express').Router();
const bodyParser = require('body-parser');
const usuarioController = require('./controller/usuarios-controller');
const perdidoController = require('./controller/perdidos-controller');
const encontradoController = require('./controller/encontrados-controller');
const multiparty = require('multiparty-express').multipartyExpress;

rotas.use(bodyParser.urlencoded({extended: true}));


function autenticar(req, res, next) {
    if (req.session.autenticado == true){
        next();
    }else{
        res.redirect('/login');
    }
}

rotas.get('/teste', (req,res)=>{
    console.log(req.query);
    res.send(req.query);
});

rotas.get("/", (req,res) => {
    res.redirect("/home");
});

rotas.get("/home", (req,res) => {
    res.render('home');
});

rotas.post("/cadastroHome", usuarioController.consistenciaCadastroHome);

rotas.get("/cadastro", usuarioController.renderizarCadastro);
rotas.post("/cadastro", usuarioController.consistenciaCadastro);

rotas.get("/login", usuarioController.renderizarLogin);
rotas.post("/login", usuarioController.verificaLogin);

rotas.get("/perfil", autenticar, (req,res) =>{
    res.redirect("/perfil/registrar");
});

rotas.get("/perfil/registrar", autenticar, usuarioController.entrarRegistrar);
rotas.post("/perfil/registrar/animalPerdido", multiparty(), perdidoController.cadastrarPerdido);
rotas.post("/perfil/registrar/animalEncontrado", multiparty(), encontradoController.cadastrarEncontrado);

rotas.get("/perfil/configuracao", autenticar, usuarioController.entrarConfiguracao);
rotas.post("/perfil/configuracao/alterarNome", autenticar, usuarioController.updateNome);
rotas.post("/perfil/configuracao/alterarTelefone", autenticar, usuarioController.updateTelefone);
rotas.post("/perfil/configuracao/alterarSenha", autenticar, usuarioController.updateSenha);
rotas.post("/perfil/configuracao/alterarFoto", autenticar, multiparty(), usuarioController.updateFoto);

rotas.get("/perfil/animais", autenticar, usuarioController.entrarAnimais);
rotas.get("/perfil/animais/remover", autenticar, usuarioController.removerAnimal);

rotas.get("/perfil/matches", autenticar, usuarioController.entrarMatches);
rotas.get("/perfil/matches/remover", autenticar, usuarioController.removerMatch);
rotas.get("/perfil/matches/resolver", autenticar, usuarioController.resolverMatch);

rotas.get("/logout", usuarioController.deslogar);

rotas.get("/perdidos", perdidoController.renderizarPerdidos);
rotas.get("/perdidos/filtrar", perdidoController.filtrarPerdidos);
rotas.post("/perdidos", perdidoController.mudarEspecie);

rotas.get("/encontrados", encontradoController.renderizarEncontrados);
rotas.get("/encontrados/filtrar", encontradoController.filtrarEncontrados);
rotas.post("/encontrados", encontradoController.mudarEspecie);







rotas.get("/sobrenos", (req, res) => {
    res.render("sobrenos");
});

module.exports = rotas