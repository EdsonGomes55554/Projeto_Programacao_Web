window.addEventListener("load", function() {
    let json = [
        {"especie":"cachorro","imagem":"../image/dog.jpg", "raca":"Vira-Lata", "cor":"Branco", "porte": "Grande",
            "desc":"Exige muito de ti e espera pouco dos outros. Assim, evitarás muitos aborrecimentos.", "local": "Santo André, UFABC"}, 

        {"especie":"cachorro","imagem":"../image/dog.jpg", "raca":"Pastor Alemão", "cor":"Branco", "porte": "Grande",
             "desc":".sotnemicerroba sotium sárative ,missA .sortuo sod ocuop arepse e it ed otium egixE", "local": "Santo André, Shopping Grand Plaza"},

        {"especie":"gato","imagem":"../image/catfinal.png", "raca":"Persa", "cor":"Branco", "porte": "Grande",
            "desc":"Exige muito de ti e espera pouco dos outros. Assim, evitarás muitos aborrecimentos.", "local": "Santo André, Parque Celso Daniel"}, 

        {"especie":"gato","imagem":"../image/catfinal.png", "raca":"Siamês", "cor":"Azul", "porte": "Grande",
            "desc":".sotnemicerroba sotium sárative ,missA .sortuo sod ocuop arepse e it ed otium egixE", "local": "Santo André, UFABC"}
        ];
    let animais = JSON.parse(JSON.stringify(json));
    /*let racasCachorros = ["Vira-Lata", "Pastor Alemão", "Doberman", "Pastor Belga", "Pinscher", "Rottweiler"];
    let racasGatos = ["Vira-Lata", "Persa", "Himalaio", "Scottish Fold", "Siamês", "Siberiano"];*/
    let racasCachorros = [];
    let racasGatos = [];

    let corCachorros = [];
    let corGatos = [];

    let porteCachorros = [];
    let porteGatos = [];

    const nodePai = document.querySelector(".resultado").firstElementChild.cloneNode(true);

    let map;

    let markers = [];

    let btnCachorro = document.getElementById("cachorro");
    let btnGato = document.getElementById("gato");
    let btnFiltrar = document.getElementById("filtrar");

    vetoresUnicos(json);
    AtualizaSelect(racasCachorros, "#selectRaca", "Raça");
    AtualizaSelect(corCachorros, "#selectCor", "Cor");
    AtualizaSelect(porteCachorros, "#selectPorte", "Porte");
    centralizarMapa("Rua Waldemar Martins Ferreira, 425, São Bernardo do Campo");
    trocarAnimal("cachorro");


    

    function limpar(elemento) {
        let node = document.querySelector(elemento);
        while (node.hasChildNodes()) {
            node.removeChild(node.lastChild);
        }
    }

    function adicionarAnimais(especie) {
        let resultado = document.querySelector(".resultado");
        let valorRaca= document.querySelector("#selectRaca").value;
        let valorCor= document.querySelector("#selectCor").value;
        let valorPorte= document.querySelector("#selectPorte").value;
        
        removerMarkers();

        animais.forEach(animal => {
            if(animal.especie == especie) {
                if(valorRaca == 0 || valorRaca == animal.raca) {
                    if(valorCor == 0 || valorCor == animal.cor) {
                        if(valorPorte == 0 || valorPorte == animal.porte) {
                            const nodeNovo = nodePai.cloneNode(true);
                            nodeNovo.querySelector(".imagem img").src = animal.imagem;
                            nodeNovo.querySelector(".tags .raca span").innerHTML = animal.raca;
                            nodeNovo.querySelector(".tags .cor span").innerHTML = animal.cor;
                            nodeNovo.querySelector(".tags .porte span").innerHTML = animal.porte;
                            nodeNovo.querySelector(".desc span").innerHTML = animal.desc; //falta data
                            nodeNovo.querySelector(".mais .local span").innerHTML = animal.local;
                            resultado.appendChild(nodeNovo);

                            criarMarker(animal.local);
                        }
                    }
                }
            }
        });
        adicionarMarkers();
    }

    function trocarAnimal(especie) {
        limpar(".resultado");
        adicionarAnimais(especie);
    }

    function centralizarMapa(address) {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
                map = new google.maps.Map(document.getElementById("map"), {zoom: 10, center: results[0].geometry.location} );
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function criarMarker(address) {
        let geocoder = new google.maps.Geocoder();
        geocoder.geocode({'address': address}, function(results, status) {
            if (status === google.maps.GeocoderStatus.OK) {
              let marker = new google.maps.Marker({
                    position: results[0].geometry.location,
                    map: map,
                    title: address
                });
                console.log(map);
                markers.push(marker);
            } else {
              alert('Geocode was not successful for the following reason: ' + status);
            }
        });
    }

    function adicionarMarkers() {
        markers.forEach(marker => {
            marker.setMap(map);
        });
    }

    function removerMarkers() {
        markers.forEach(marker => {
            marker.setMap(null);
        });
        markers = [];
    }

    btnFiltrar.addEventListener('click', function(){
        if(btnCachorro.checked){
            trocarAnimal("cachorro");
        } else if(btnGato.checked){
            trocarAnimal("gato");
        }
    });
    
    function vetoresUnicos(json){
        let dados = JSON.parse(JSON.stringify(json));
        dados.forEach(animal =>{
            separador(racasCachorros, animal.raca, animal.especie, "cachorro");
            separador(racasGatos, animal.raca, animal.especie, "gato");
            separador(corCachorros, animal.cor, animal.especie, "cachorro");
            separador(corGatos, animal.cor, animal.especie, "gato");
            separador(porteCachorros, animal.porte, animal.especie, "cachorro");
            separador(porteGatos, animal.porte, animal.especie, "gato");
        });
    }

    function separador(vetor, dado, especieAnimal, especieReq){
        if(vetor.indexOf(dado) == -1 && especieAnimal == especieReq){
            vetor.push(dado);
        }
    }

    function criarPlaceholderOption(frase, nodePai){
        let tag = document.createElement("option");
        tag.innerHTML=frase;
        tag.disabled = true;
        tag.selected = true;
        tag.hidden = true;
        tag.value = "0";
        nodePai.appendChild(tag);
    }

    function criarOption(frase, nodePai){
        let tag = document.createElement("option");
        tag.innerHTML=frase;
        tag.value = frase;
        nodePai.appendChild(tag);
    }

    function AtualizaSelect(vetor, select, placeholder){
        limpar(select);
        let selectElemento= document.querySelector(select);
        criarPlaceholderOption(placeholder, selectElemento);
        vetor.forEach(raca => {
            criarOption(raca, selectElemento);
        });
    }

    btnCachorro.addEventListener('click', function() {
        AtualizaSelect(racasCachorros, "#selectRaca", "Raça");
        AtualizaSelect(corCachorros, "#selectCor", "Cor");
        AtualizaSelect(porteCachorros, "#selectPorte", "Porte");
    });

    btnGato.addEventListener('click', function() {
        AtualizaSelect(racasGatos, "#selectRaca", "Raça");
        AtualizaSelect(corGatos, "#selectCor", "Cor");
        AtualizaSelect(porteGatos, "#selectPorte", "Porte");
    });
});