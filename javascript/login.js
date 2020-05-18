window.addEventListener("load", function() {
    let json = [{"email":"a@gmail.com", "senha":"123"}, {"email":"teste@gmail.com", "senha":"senha"}];
    let contas = JSON.parse(JSON.stringify(json));
    let btnEntrar = document.getElementById("btnEntrar");

    function entrar() {
        let usuario = document.getElementById("email").value;
        let senha = document.getElementById("senha").value;
        let contaValida = false;

        contas.forEach(conta => {
            if (conta.email == usuario && conta.senha == senha) {
                contaValida = true;
                btnEntrar.setAttribute("href", "../html/home.html");
            }
        });
        
        if(!contaValida) {
            alert("Por favor cheque se o seu email ou senha foram inseridos corretamente.");
        }
    }
    
    btnEntrar.addEventListener("click", entrar);
});