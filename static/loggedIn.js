window.addEventListener("load", function() {
    let btnSair = document.getElementById("sair");

    if (sessionStorage.getItem('status') != null || localStorage.getItem('status') != null) {
        let areaLogado = document.getElementById("areaLogado");
        areaLogado.hidden = false;
    } else{
        let areaNaoLogado = document.getElementById("areaNaoLogado");
        areaNaoLogado.hidden = false;
    }

    function sair() {
        sessionStorage.removeItem('status');
        localStorage.removeItem('status');
        window.location.reload(true);
    }

    btnSair.addEventListener("click", sair);
});