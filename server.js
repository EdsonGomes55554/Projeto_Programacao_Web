"use strict";

global.__rootdir = __dirname;

const express = require('express');
const handlebars = require('express-handlebars');
const path = require('path');
const process = require('process');
const session = require('express-session');

const confDB = require('./config.json');
const conexaoBanco = require('./models/conexaoBanco');
const rotas = require('./rotas');


const app = express();


app.listen(3000, ()=>{
    conexaoBanco.conectar(() => {
        console.log("Servidor Aberto");
    });
});

const confhbs = handlebars.create({
    helpers: {section: require('./views/helpers/helpers').section,
              isNull: require('./views/helpers/helpers').isNull}
});

app.engine('handlebars', confhbs.engine);
app.set('view engine', 'handlebars');
app.set('views', path.resolve(__dirname, 'views'));


app.use('/static', express.static(path.join(__dirname, '/static')));

app.use('/updates', express.static(path.join(__dirname, '/updates')));

app.use(session({
    secret: confDB.sessionSegredo,
    resave: false,
    saveUninitialized: false,
    store: conexaoBanco.sessionStore
}));

app.use((req, res, next) => {
    res.locals.session = req.session;
    next();
});

app.use(rotas);

process.on('exit', () => {
    conexaoBanco.desconectar(() => {
        console.log("Servidor Fechado");
    });
});

let exitHandler = code => {
    process.exit();
}

process.once('SIGINT', exitHandler);
process.once('SIGUSR2', exitHandler);