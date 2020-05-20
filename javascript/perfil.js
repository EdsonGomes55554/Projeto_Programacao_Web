window.addEventListener("load", function() {
    let json = 
        {"nome":"Emerson Graciano",
        "imagem":"../image/catfinal.png",
         "emblemas":['emblemaCasoResolvido','emblemaSalvadorDePets' ]};
    let perfil = JSON.parse(JSON.stringify(json));

    let btnSairNavbar = document.getElementById("sair");
    let btnSair = document.getElementById("btnSair");
    let btnRegistrar = document.getElementById("btnRegistrar");
    let btnConfiguracao = this.document.getElementById("btnConfiguracao");

    inicializar();

    function inicializar() {
        let areaPerfil = document.querySelector(".perfil");
        areaPerfil.querySelector(".foto img").src = perfil.imagem;
        areaPerfil.querySelector(".info .nome h4").innerHTML = perfil.nome;
        perfil.emblemas.forEach(emblema => {
            if(emblema == "emblemaCasoResolvido") {
                document.getElementById("emblemaCasoResolvido").hidden = false;
            } else if(emblema == "emblemaSalvadorDePets") {
                document.getElementById("emblemaSalvadorDePets").hidden = false;
            }
        });

        adicionarBotoesRegistrar();
    }

    function sair() {
        sessionStorage.removeItem('status');
    }

    function limpaAtivos(){
        if(btnRegistrar.classList.contains("ativo")){
            btnRegistrar.classList.remove("ativo");
        }
        if(btnConfiguracao.classList.contains("ativo")){
            btnConfiguracao.classList.remove("ativo");
        }
    }

    function adicionarBotoesRegistrar() {
        limparAcoes();
        limpaAtivos();
        btnRegistrar.classList.add("ativo");
        let acoes = document.querySelector(".acoes");

        let form = document.createElement("form");
        form.classList.add("formulario");


        criarSeletorEspecie(form);
        criarInput("input", "Cor", "cor",  form);
        criarInput("input", "Raça", "raca",  form);
        criarInput("input", "Porte", "porte",  form);
        criarInput("input", "Descrição", "desc",  form);
        criarInput("input", "Localizacao", "localizacao",  form);
        criarInput("date", "Data", "data",  form);
        criarInputImagem(form);
        let div = document.createElement("div")
        div.classList.add("juncao");
        criarBotao("submit", "Registrar como animal encontrado", "btnRegistrarEncontrado", div);
        criarBotao("submit", "Registrar como animal perdido", "btnRegistrarPerdido", div);
        form.appendChild(div);

        acoes.append(form);

        let btnRegistrarEncontrado = document.getElementById("btnRegistrarEncontrado");
        btnRegistrarEncontrado.addEventListener("click", registrarAnimalEncontrado);

        let btnRegistrarPerdido = document.getElementById("btnRegistrarPerdido");
        btnRegistrarPerdido.addEventListener("click", registrarAnimalPerdido);
    }


    function adicionarBotoesConfiguracao() {
        limparAcoes();
        limpaAtivos();
        btnConfiguracao.classList.add("ativo");
        let acoes = document.querySelector(".acoes");

        let form = document.createElement("form");
        form.classList.add("formulario");

        criarInput("input", "Nome", "nome",  form);
        criarInput("input", "Email", "email",  form);
        criarInput("input", "Telefone", "telefone",  form);
        criarInputImagem(form);
        criarBotao("submit", "Atualizar dados", "btnAtualizarDados", form);
        acoes.append(form);

        let btnAtualizarDados = document.getElementById("btnAtualizarDados");
        btnAtualizarDados.addEventListener("click", atualizarDados);
    }

    function atualizarDados() {
        alert("Dados atualizados com sucesso");
    }

    function registrarAnimalPerdido() {
        alert("Animal perdido adicionado com sucesso");
    }

    function registrarAnimalEncontrado() {
        alert("Animal encontrado adicionado com sucesso");
    }

    function criarSeletorEspecie(nodePai) {
        let div = document.createElement("div");
        div.classList.add("btn-group");
        div.classList.add("btn-group-toggle");
        div.classList.add("my-4");
        div.dataset.toggle = "buttons";
        div.id = "groupButton";

        let labelCachorro = document.createElement("label");
        labelCachorro.classList.add("btn");
        labelCachorro.classList.add("btn-secondary");
        labelCachorro.classList.add("tamanhoButton");
        labelCachorro.classList.add("active");
        labelCachorro.innerHTML = "Cachorro";
        addRadio("cachorro", true, labelCachorro);

        let labelGato = document.createElement("label");
        labelGato.classList.add("btn");
        labelGato.classList.add("btn-secondary");
        labelGato.classList.add("tamanhoButton");
        labelGato.innerHTML = "Gato";
        addRadio("gato", false, labelGato);

        div.appendChild(labelCachorro);
        div.appendChild(labelGato);
        nodePai.appendChild(div);
    }

    function addRadio(id, checked, nodepai) {
        let input = document.createElement("input");
        input.type = "radio";
        input.name = "options";
        input.id = id;
        input.autocomplete = "off";
        input.checked = checked;
        nodepai.appendChild(input);
    }

    function limparAcoes() {
        let acoes = document.querySelector(".acoes");
        while(acoes.hasChildNodes()) {
            acoes.removeChild(acoes.firstChild);
        }
    }

    function criarInputImagem(nodePai) {
        let div = document.createElement("div");
        div.classList.add("custom-file");
        let input = document.createElement("input");
        input.type = "file";
        input.classList.add("custom-file-input");
        let label = document.createElement("label");
        label.classList.add("custom-file-label");
        label.innerHTML = "Envie uma foto";
        div.appendChild(input);
        div.appendChild(label);
        nodePai.appendChild(div);
    }

    function criarInput(tipo, placeholder, id, nodePai) {
        let div = document.createElement("div");
        div.classList.add("form-group");
        let input = document.createElement("input");
        input.classList.add("form-control");
        input.type = tipo;
        input.placeholder = placeholder;
        input.id = id;
        div.appendChild(input);
        nodePai.appendChild(div);
    }

    function criarBotao(tipo, texto, id, nodePai) {
        let div = document.createElement("div");
        div.classList.add("form-group");
        let botao = document.createElement("button");
        botao.classList.add("btn");
        botao.classList.add("btn-success");
        botao.classList.add("tamanhoBotaoRegistro");
        botao.type = tipo;
        botao.innerHTML = texto;
        botao.id = id;
        div.appendChild(botao);
        nodePai.appendChild(div);
    }



    btnSairNavbar.addEventListener('click', sair);
    btnSair.addEventListener('click', sair);
    btnRegistrar.addEventListener('click', adicionarBotoesRegistrar);
    btnConfiguracao.addEventListener('click', adicionarBotoesConfiguracao);
});