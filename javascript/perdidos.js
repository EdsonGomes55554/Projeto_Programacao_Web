window.addEventListener("load", function() {
    let json = [
        {"especie":"cachorro","imagem":"../image/dog.jpg", "raca":"Vira-Lata", "cor":"Branco", "porte": "Grande",
            "desc":"Exige muito de ti e espera pouco dos outros. Assim, evitarás muitos aborrecimentos."}, 

        {"especie":"cachorro","imagem":"../image/dog.jpg", "raca":"Pastor Alemão", "cor":"Branco", "porte": "Grande",
             "desc":"Exige muito de ti e espera pouco dos outros. Assim, evitarás muitos aborrecimentos."},

        {"especie":"gato","imagem":"../image/catfinal.png", "raca":"Persa", "cor":"Branco", "porte": "Grande",
            "desc":"Exige muito de ti e espera pouco dos outros. Assim, evitarás muitos aborrecimentos."}, 

        {"especie":"gato","imagem":"../image/catfinal.png", "raca":"Siamês", "cor":"Branco", "porte": "Grande",
            "desc":"Exige muito de ti e espera pouco dos outros. Assim, evitarás muitos aborrecimentos."}
        ];
    let animais = JSON.parse(JSON.stringify(json));
    let racasCachorros = ["Vira-Lata", "Pastor Alemão", "Doberman", "Pastor Belga", "Pinscher", "Rottweiler"];
    let racasGatos = ["Vira-Lata", "Persa", "Himalaio", "Scottish Fold", "Siamês", "Siberiano"];

    let groupButton = document.getElementById("groupButton");
    let btnCachorro = document.getElementById("cachorro");
    let btnGato = document.getElementById("gato");
    let btnFiltrar = document.getElementById("filtrar");

    function limpar() {
        let resultado = document.querySelector(".resultado");
        const node = resultado.firstElementChild.cloneNode(true);
        while (resultado.hasChildNodes()) {
            resultado.removeChild(resultado.lastChild);
        }
        return node;
    }

    function adicionarAnimais(especie, node) {
        let resultado = document.querySelector(".resultado");
        animais.forEach(animal => {
            if(animal.especie == especie) {
                const nodeNovo = node.cloneNode(true);
                nodeNovo.querySelector(".imagem img").src = animal.imagem;
                nodeNovo.querySelector(".tags .raca span").innerHTML = animal.raca;
                nodeNovo.querySelector(".tags .cor span").innerHTML = animal.cor;
                nodeNovo.querySelector(".tags .porte span").innerHTML = animal.porte;
                nodeNovo.querySelector(".desc span").innerHTML = animal.desc; //falta local e data
                resultado.appendChild(nodeNovo);
            }
        });
    }

    function trocarAnimal(especie) {
        let node = limpar();
        adicionarAnimais(especie, node);
    }

    btnFiltrar.addEventListener('click', function(){
        if(btnCachorro.checked){
            trocarAnimal("cachorro");
        } else if(btnGato.checked){
            trocarAnimal("gato");
        }
    });
    
    btnCachorro.addEventListener('click', function() {
        let selectRaca = document.querySelector("#selectRaca");
        selectRaca.selectedIndex = 0;
        const node = selectRaca.lastElementChild.cloneNode(true);
        while (selectRaca.childElementCount > 1) {
            selectRaca.removeChild(selectRaca.lastChild);
        }
        racasCachorros.forEach(raca => {
            const nodeNovo = node.cloneNode(true);
            nodeNovo.innerHTML = raca;
            selectRaca.appendChild(nodeNovo);
        });
    });

    btnGato.addEventListener('click', function() {
        let selectRaca = document.querySelector("#selectRaca");
        selectRaca.selectedIndex = 0;
        const node = selectRaca.lastElementChild.cloneNode(true);
        while (selectRaca.childElementCount > 1) {
            selectRaca.removeChild(selectRaca.lastChild);
        }
        racasGatos.forEach(raca => {
            console.log("a");
            const nodeNovo = node.cloneNode(true);
            nodeNovo.innerHTML = raca;
            selectRaca.appendChild(nodeNovo);
        });
    });

    /*function clickBtnCachorro() {
        trocarAnimal("cachorro");
    }

    function clickBtnGato() {
        trocarAnimal("gato");
    }

    function clickBtnFiltrar() {
    }

    btnFiltrar.addEventListener('click', clickBtnFiltrar);
    btnCachorro.addEventListener('click', clickBtnCachorro);
    btnGato.addEventListener('click', clickBtnGato);*/
});