window.addEventListener("load", function() {
    if (sessionStorage.getItem('status') != null) {
        let areaLogado = document.getElementById("areaLogado");
        areaLogado.hidden = false;
    } else{
        let areaNaoLogado = document.getElementById("areaNaoLogado");
        areaNaoLogado.hidden = false;
    }
});